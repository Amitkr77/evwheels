import React from "react";

export default function page() {
  return (
    <section className="bg-background-light dark:bg-background-dark text-text-main dark:text-gray-100 font-display transition-colors duration-200">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <main className="flex-grow">
          <section className="bg-white dark:bg-[#1a2c15] border-b border-[#e5eadd] dark:border-[#2a3825] py-16 md:py-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
            <div className="max-w-[1280px] mx-auto px-4 md:px-10 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                  <span className="material-symbols-outlined text-sm">build</span>
                  Part Finder
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-main dark:text-white mb-6 tracking-tight">
                  Find the perfect fit
                  <br />
                  <span className="text-primary">for your ride.</span>
                </h1>
                <p className="text-lg text-text-muted dark:text-gray-400 max-w-2xl mx-auto">
                  Don't guess. Select your model below to instantly filter our
                  catalog for compatible parts, batteries, and upgrades
                  guaranteed to work.
                </p>
              </div>
              <div className="max-w-4xl mx-auto bg-white dark:bg-[#142210] rounded-2xl p-4 shadow-xl shadow-black/5 border border-gray-100 dark:border-gray-800">
                <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-muted dark:text-gray-500 uppercase tracking-wider ml-1">
                      Category
                    </label>
                    <div className="relative">
                      <select className="w-full rounded-xl bg-gray-50 dark:bg-[#22301d] border-transparent focus:border-primary focus:ring-primary text-text-main dark:text-white font-medium py-3 pl-4">
                        <option disabled="" selected="">
                          Select Type
                        </option>
                        <option>E-Bikes</option>
                        <option>E-Scooters</option>
                        <option>Accessories</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-muted dark:text-gray-500 uppercase tracking-wider ml-1">
                      Brand
                    </label>
                    <div className="relative">
                      <select className="w-full rounded-xl bg-gray-50 dark:bg-[#22301d] border-transparent focus:border-primary focus:ring-primary text-text-main dark:text-white font-medium py-3 pl-4">
                        <option disabled="" selected="">
                          Select Brand
                        </option>
                        <option>EvWheels</option>
                        <option>Urban Glide</option>
                        <option>Mountain King</option>
                        <option>VoltX</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-muted dark:text-gray-500 uppercase tracking-wider ml-1">
                      Model
                    </label>
                    <div className="relative">
                      <select className="w-full rounded-xl bg-gray-50 dark:bg-[#22301d] border-transparent focus:border-primary focus:ring-primary text-text-main dark:text-white font-medium py-3 pl-4">
                        <option disabled="" selected="">
                          Select Model
                        </option>
                        <option>Glide X1</option>
                        <option>Glide X2 Pro</option>
                        <option>Ranger 500</option>
                        <option>City Commuter</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      className="w-full py-3.5 bg-primary hover:bg-[#3ce00b] text-primary-content font-bold rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                      type="button"
                    >
                      <span className="material-symbols-outlined">
                        search_check
                      </span>
                      Check Fit
                    </button>
                  </div>
                </form>
              </div>
              <div className="flex items-center justify-center gap-2 mt-6 text-sm text-text-muted dark:text-gray-500">
                <span className="material-symbols-outlined text-lg">info</span>
                <span>
                  Not sure about your model?{" "}
                  <a className="underline decoration-primary underline-offset-4 hover:text-text-main dark:hover:text-white transition-colors cursor-pointer">
                    Find your serial number
                  </a>
                </span>
              </div>
            </div>
          </section>
          <section className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-text-main dark:text-white mb-2">
                  Popular Models
                </h2>
                <p className="text-text-muted dark:text-gray-400">
                  Browse parts for our best-selling vehicles.
                </p>
              </div>
              <a
                className="flex items-center gap-1 font-bold text-primary hover:gap-2 transition-all"
                href="#"
              >
                View all models{" "}
                <span className="material-symbols-outlined text-lg">
                  arrow_forward
                </span>
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <a
                className="group bg-white dark:bg-[#1a2c15] rounded-2xl border border-[#e5eadd] dark:border-[#2a3825] overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                href="#"
              >
                <div className="h-48 bg-gray-100 dark:bg-[#22301d] relative flex items-center justify-center group-hover:bg-[#f1f5f0] transition-colors">
                  <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors">
                    pedal_bike
                  </span>
                  <div className="absolute top-4 right-4 bg-white dark:bg-black/50 px-2 py-1 rounded text-xs font-bold text-text-main dark:text-white shadow-sm backdrop-blur-sm">
                    2023 Series
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-text-main dark:text-white mb-1 group-hover:text-primary transition-colors">
                    Urban Glide X1
                  </h3>
                  <p className="text-sm text-text-muted dark:text-gray-400 mb-4">
                    City Commuter E-Bike
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-xs font-semibold text-text-muted dark:text-gray-500">
                      42 compatible parts
                    </span>
                    <span className="material-symbols-outlined text-primary text-xl">
                      arrow_circle_right
                    </span>
                  </div>
                </div>
              </a>
              <a
                className="group bg-white dark:bg-[#1a2c15] rounded-2xl border border-[#e5eadd] dark:border-[#2a3825] overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                href="#"
              >
                <div className="h-48 bg-gray-100 dark:bg-[#22301d] relative flex items-center justify-center group-hover:bg-[#f1f5f0] transition-colors">
                  <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors">
                    electric_scooter
                  </span>
                  <div className="absolute top-4 right-4 bg-white dark:bg-black/50 px-2 py-1 rounded text-xs font-bold text-text-main dark:text-white shadow-sm backdrop-blur-sm">
                    Pro Edition
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-text-main dark:text-white mb-1 group-hover:text-primary transition-colors">
                    VoltX Scooter
                  </h3>
                  <p className="text-sm text-text-muted dark:text-gray-400 mb-4">
                    Long Range E-Scooter
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-xs font-semibold text-text-muted dark:text-gray-500">
                      28 compatible parts
                    </span>
                    <span className="material-symbols-outlined text-primary text-xl">
                      arrow_circle_right
                    </span>
                  </div>
                </div>
              </a>
              <a
                className="group bg-white dark:bg-[#1a2c15] rounded-2xl border border-[#e5eadd] dark:border-[#2a3825] overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                href="#"
              >
                <div className="h-48 bg-gray-100 dark:bg-[#22301d] relative flex items-center justify-center group-hover:bg-[#f1f5f0] transition-colors">
                  <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors">
                    directions_bike
                  </span>
                  <div className="absolute top-4 right-4 bg-white dark:bg-black/50 px-2 py-1 rounded text-xs font-bold text-text-main dark:text-white shadow-sm backdrop-blur-sm">
                    Off-Road
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-text-main dark:text-white mb-1 group-hover:text-primary transition-colors">
                    Ranger 500
                  </h3>
                  <p className="text-sm text-text-muted dark:text-gray-400 mb-4">
                    Mountain E-Bike
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-xs font-semibold text-text-muted dark:text-gray-500">
                      56 compatible parts
                    </span>
                    <span className="material-symbols-outlined text-primary text-xl">
                      arrow_circle_right
                    </span>
                  </div>
                </div>
              </a>
              <a
                className="group bg-white dark:bg-[#1a2c15] rounded-2xl border border-[#e5eadd] dark:border-[#2a3825] overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                href="#"
              >
                <div className="h-48 bg-gray-100 dark:bg-[#22301d] relative flex items-center justify-center group-hover:bg-[#f1f5f0] transition-colors">
                  <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors">
                    moped
                  </span>
                  <div className="absolute top-4 right-4 bg-white dark:bg-black/50 px-2 py-1 rounded text-xs font-bold text-text-main dark:text-white shadow-sm backdrop-blur-sm">
                    Legacy
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-text-main dark:text-white mb-1 group-hover:text-primary transition-colors">
                    City Mate V1
                  </h3>
                  <p className="text-sm text-text-muted dark:text-gray-400 mb-4">
                    Compact Moped
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-xs font-semibold text-text-muted dark:text-gray-500">
                      15 compatible parts
                    </span>
                    <span className="material-symbols-outlined text-primary text-xl">
                      arrow_circle_right
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </section>
          <section className="bg-[#f6f8f5] dark:bg-[#111c0e] py-16 border-y border-[#e5eadd] dark:border-[#2a3825]">
            <div className="max-w-[1280px] mx-auto px-4 md:px-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-text-main dark:text-white mb-4">
                    How to identify your model?
                  </h2>
                  <p className="text-text-muted dark:text-gray-400 mb-8 leading-relaxed">
                    To ensure you purchase the correct parts, you'll need the
                    exact model name or serial number of your vehicle. Here is
                    where you can typically find this information.
                  </p>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="size-12 shrink-0 rounded-full bg-white dark:bg-[#1a2c15] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-primary shadow-sm">
                        <span className="material-symbols-outlined">qr_code_2</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-text-main dark:text-white mb-1">
                          Check the frame sticker
                        </h4>
                        <p className="text-sm text-text-muted dark:text-gray-500">
                          Usually located on the underside of the frame near the
                          pedals or under the battery pack.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="size-12 shrink-0 rounded-full bg-white dark:bg-[#1a2c15] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-primary shadow-sm">
                        <span className="material-symbols-outlined">menu_book</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-text-main dark:text-white mb-1">
                          Consult your manual
                        </h4>
                        <p className="text-sm text-text-muted dark:text-gray-500">
                          Your original owner's manual will have the model
                          specifications on the first page.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="size-12 shrink-0 rounded-full bg-white dark:bg-[#1a2c15] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-primary shadow-sm">
                        <span className="material-symbols-outlined">
                          support_agent
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-text-main dark:text-white mb-1">
                          Ask our experts
                        </h4>
                        <p className="text-sm text-text-muted dark:text-gray-500">
                          Send us a photo of your bike, and we'll help you
                          identify it instantly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-[#1a2c15] border border-gray-200 dark:border-gray-800 p-8 shadow-lg">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="material-symbols-outlined text-9xl">
                      pedal_bike
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-text-main dark:text-white mb-6">
                      Common Serial Number Locations
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-[#22301d] p-4 rounded-xl text-center">
                        <span className="material-symbols-outlined text-3xl text-primary mb-2">
                          location_on
                        </span>
                        <p className="font-bold text-sm text-text-main dark:text-white">
                          Bottom Bracket
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-[#22301d] p-4 rounded-xl text-center">
                        <span className="material-symbols-outlined text-3xl text-primary mb-2">
                          location_on
                        </span>
                        <p className="font-bold text-sm text-text-main dark:text-white">
                          Head Tube
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-[#22301d] p-4 rounded-xl text-center">
                        <span className="material-symbols-outlined text-3xl text-primary mb-2">
                          location_on
                        </span>
                        <p className="font-bold text-sm text-text-main dark:text-white">
                          Rear Dropout
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-[#22301d] p-4 rounded-xl text-center">
                        <span className="material-symbols-outlined text-3xl text-primary mb-2">
                          location_on
                        </span>
                        <p className="font-bold text-sm text-text-main dark:text-white">
                          Battery Mount
                        </p>
                      </div>
                    </div>
                    <button className="w-full mt-6 py-3 border border-gray-200 dark:border-gray-700 hover:border-primary text-text-main dark:text-white font-bold rounded-xl transition-colors hover:text-primary">
                      Download Identification Guide
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24">
            <h2 className="text-3xl font-bold text-text-main dark:text-white mb-10 text-center">
              Browse Compatibility by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <a
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white dark:bg-[#1a2c15] border border-[#e5eadd] dark:border-[#2a3825] hover:border-primary hover:shadow-md transition-all group"
                href="#"
              >
                <span className="material-symbols-outlined text-3xl text-text-muted dark:text-gray-400 group-hover:text-primary transition-colors">
                  battery_charging_full
                </span>
                <span className="font-medium text-sm text-text-main dark:text-white">
                  Batteries
                </span>
              </a>
              <a
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white dark:bg-[#1a2c15] border border-[#e5eadd] dark:border-[#2a3825] hover:border-primary hover:shadow-md transition-all group"
                href="#"
              >
                <span className="material-symbols-outlined text-3xl text-text-muted dark:text-gray-400 group-hover:text-primary transition-colors">
                  tire_repair
                </span>
                <span className="font-medium text-sm text-text-main dark:text-white">
                  Tires &amp; Tubes
                </span>
              </a>
              <a
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white dark:bg-[#1a2c15] border border-[#e5eadd] dark:border-[#2a3825] hover:border-primary hover:shadow-md transition-all group"
                href="#"
              >
                <span className="material-symbols-outlined text-3xl text-text-muted dark:text-gray-400 group-hover:text-primary transition-colors">
                  bolt
                </span>
                <span className="font-medium text-sm text-text-main dark:text-white">
                  Chargers
                </span>
              </a>
              <a
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white dark:bg-[#1a2c15] border border-[#e5eadd] dark:border-[#2a3825] hover:border-primary hover:shadow-md transition-all group"
                href="#"
              >
                <span className="material-symbols-outlined text-3xl text-text-muted dark:text-gray-400 group-hover:text-primary transition-colors">
                  memory
                </span>
                <span className="font-medium text-sm text-text-main dark:text-white">
                  Controllers
                </span>
              </a>
              <a
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white dark:bg-[#1a2c15] border border-[#e5eadd] dark:border-[#2a3825] hover:border-primary hover:shadow-md transition-all group"
                href="#"
              >
                <span className="material-symbols-outlined text-3xl text-text-muted dark:text-gray-400 group-hover:text-primary transition-colors">
                  settings
                </span>
                <span className="font-medium text-sm text-text-main dark:text-white">
                  Brakes
                </span>
              </a>
              <a
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white dark:bg-[#1a2c15] border border-[#e5eadd] dark:border-[#2a3825] hover:border-primary hover:shadow-md transition-all group"
                href="#"
              >
                <span className="material-symbols-outlined text-3xl text-text-muted dark:text-gray-400 group-hover:text-primary transition-colors">
                  grid_view
                </span>
                <span className="font-medium text-sm text-text-main dark:text-white">
                  View All
                </span>
              </a>
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}
