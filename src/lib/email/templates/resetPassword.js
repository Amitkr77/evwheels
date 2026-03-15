export function resetPasswordTemplate(resetLink) {
    return `
  <div style="font-family: Arial, sans-serif; padding:20px;">
    <h2>Password Reset</h2>

    <p>You requested a password reset.</p>

    <a href="${resetLink}" 
       style="
         display:inline-block;
         padding:12px 20px;
         background:#059669;
         color:white;
         text-decoration:none;
         border-radius:6px;
         margin-top:10px;
       ">
       Reset Password
    </a>

    <p style="margin-top:20px;font-size:12px;color:#888">
      This link expires in 15 minutes.
    </p>
  </div>
  `;
}