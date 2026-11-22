function Terms() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-white">
      <div className="bg-white border-2 border-black rounded-lg p-8 shadow-sm">
        <div className="border-b-2 border-black pb-5 mb-8">
          <h1 className="text-2xl font-extrabold text-black tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Effective Date: November 22, 2026. Applicable to all platform users.
          </p>
        </div>

        <div className="space-y-6 text-sm text-neutral-800 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-black mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or utilizing the ShopKaro inventory management and e-commerce platform, you confirm your adherence to these Terms and Conditions and all applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
              2. User Roles and Account Governance
            </h2>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
              <li>
                <strong>Customer Accounts:</strong> Permitted to explore verified products, manage personal cart entries, submit purchase requests, and cancel eligible pending or confirmed orders. Customers may not inspect or modify orders belonging to another user.
              </li>
              <li>
                <strong>Seller Accounts:</strong> Authorized to create, update, and manage inventory units belonging strictly to their assigned catalog. Sellers cannot edit or delete listings owned by other vendors.
              </li>
              <li>
                <strong>Administrator Accounts:</strong> Vested with global oversight over storewide analytics, category creation, inventory audit logs, and account lifecycle controls.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
              3. Inventory and Stock Validation
            </h2>
            <p>
              All item prices and stock thresholds are computed exclusively on the backend server. Client-submitted prices are discarded during checkout. Inventory deductions execute through atomic database operations to prevent overselling or negative inventory states during concurrent purchases.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
              4. Order Lifecycle and Cancellations
            </h2>
            <p>
              Orders progress through verified state transitions (pending, confirmed, shipped, delivered, cancelled). Cancellation of an eligible order triggers automatic inventory restoration and generates an immutable InventoryLog record.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
              5. Platform Architecture and Custom Domain Routing
            </h2>
            <p>
              ShopKaro is structured for standalone local deployment or production cloud deployment behind reverse proxy configurations (Nginx, Traefik, or Cloudflare DNS) supporting standard custom domain bindings.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
              6. Limitation of Liability
            </h2>
            <p className="text-xs">
              ShopKaro and its authors shall not be liable for incidental or consequential damages resulting from platform misuse, unapproved third-party scripts, or unauthorized network modifications.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Terms;
