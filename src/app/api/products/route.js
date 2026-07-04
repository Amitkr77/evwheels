import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Subcategory from "@/models/Subcategory";
import Segment from "@/models/Segment";

// GET /api/products
export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const categorySlug = searchParams.get("category");
    const categoryId = searchParams.get("categoryId");
    const subcategoryId = searchParams.get("subcategory");
    const segmentId = searchParams.get("segmentId");
    const segmentSlug = searchParams.get("segment");
    const featured = searchParams.get("featured");
    const brand = searchParams.get("brand");
    const search = searchParams.get("search");
    const inStock = searchParams.get("inStock") === "true";
    const isAdmin = searchParams.get("admin") === "true";

    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 0;

    const sortBy = searchParams.get("sort") || "createdAt";
    const sortOrder = searchParams.get("order") === "asc" ? 1 : -1;

    // Admin can see all products; public only sees active ones
    const filter = isAdmin ? {} : { isActive: true };

    // Category filter by slug
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug }).select("_id").lean();
      if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }
      filter.category = category._id;
    }

    // Category filter by id
    if (categoryId) {
      filter.category = categoryId;
    }

    // Subcategory filter
    if (subcategoryId) {
      filter.subcategory = subcategoryId;
    }

    // Segment filter by slug
    if (segmentSlug) {
      const segment = await Segment.findOne({ slug: segmentSlug }).select("_id").lean();
      if (!segment) {
        return NextResponse.json({ error: "Segment not found" }, { status: 404 });
      }
      filter.segment = segment._id;
    }

    // Segment filter by id
    if (segmentId) {
      filter.segment = segmentId;
    }

    // Featured filter
    if (featured === "true") {
      filter.featured = true;
    }

    // Brand filter
    if (brand) {
      filter.brand = {
        $regex: brand,
        $options: "i",
      };
    }

    // Stock filter
    if (inStock) {
      filter.stock = {
        $gt: 0,
      };
    }

    // Price filter
    if (minPrice > 0 || maxPrice > 0) {
      filter.price = {};

      if (minPrice > 0) {
        filter.price.$gte = minPrice;
      }

      if (maxPrice > 0) {
        filter.price.$lte = maxPrice;
      }
    }

    // Text search
    if (search) {
      filter.$text = {
        $search: search,
      };
    }

    let sort = {};

    if (search) {
      sort = {
        score: {
          $meta: "textScore",
        },
      };
    } else {
      sort[sortBy] = sortOrder;
    }

    // Run products query, count, and stats aggregation in parallel
    const [products, total, statsAgg] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .populate("subcategory", "name slug")
        .populate("segment", "name slug")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
      Product.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            minPrice:   { $min: "$price" },
            maxPrice:   { $max: "$price" },
            avgPrice:   { $avg: "$price" },
            totalStock: { $sum: "$stock" },
          },
        },
      ]),
    ]);

    const stats = statsAgg[0]
      ? {
        total,
        minPrice:   statsAgg[0].minPrice,
        maxPrice:   statsAgg[0].maxPrice,
        avgPrice:   Math.round(statsAgg[0].avgPrice),
        totalStock: statsAgg[0].totalStock,
      }
      : { total, minPrice: 0, maxPrice: 0, avgPrice: 0, totalStock: 0 };

    return NextResponse.json({
      success: true,
      products,
      stats,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });


  } catch (error) {
    console.error("[products]", error.message);


    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      {
        status: 500,
      }
    );


  }
}

// POST /api/products
export async function POST(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const body = await req.json();

    const title = body.title?.trim();

    if (!title) {
      return NextResponse.json(
        {
          error: "Title is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.description?.trim()) {
      return NextResponse.json(
        {
          error: "Description is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.category) {
      return NextResponse.json(
        {
          error: "Category is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.subcategory) {
      return NextResponse.json(
        {
          error: "Subcategory is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.brand?.trim()) {
      return NextResponse.json(
        {
          error: "Brand is required",
        },
        {
          status: 400,
        }
      );
    }

    const price = Number(body.price);

    if (isNaN(price) || price <= 0) {
      return NextResponse.json(
        {
          error: "Valid price is required",
        },
        {
          status: 400,
        }
      );
    }

    const stock = Number(body.stock);

    if (isNaN(stock) || stock < 0) {
      return NextResponse.json(
        {
          error: "Valid stock is required",
        },
        {
          status: 400,
        }
      );
    }

    const category = await Category.findById(body.category);

    if (!category) {
      return NextResponse.json(
        {
          error: "Category not found",
        },
        {
          status: 404,
        }
      );
    }

    const subcategory = await Subcategory.findOne({
      _id: body.subcategory,
      category: body.category,
    });

    if (!subcategory) {
      return NextResponse.json(
        {
          error:
            "Subcategory does not belong to selected category",
        },
        {
          status: 400,
        }
      );
    }

    const images = Array.isArray(body.images)
      ? body.images
      : [];

    const specifications = Array.isArray(
      body.specifications
    )
      ? body.specifications
      : [];

    const product = await Product.create({
      title,
      description: body.description.trim(),
      price,
      stock,
      brand: body.brand.trim(),

      category: body.category,
      subcategory: body.subcategory,
      segment: category.segment,

      images,
      specifications,

      warranty: Number(body.warranty) || 0,

      color: body.color || "",

      featured: body.featured ?? false,
      isActive: body.isActive ?? true,
    });

    await product.populate(
      "category",
      "name slug"
    );

    await product.populate(
      "subcategory",
      "name slug"
    );

    await product.populate(
      "segment",
      "name slug"
    );

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product,
      },
      {
        status: 201,
      }
    );

  } catch (error) {
    console.error("[products]", error.message);


    return NextResponse.json(
      {
        success: false,
        error: "Failed to create product",
      },
      {
        status: 500,
      }
    );


  }
}
