function PrivacyPolicy() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-white">
      <div className="bg-white border-2 border-black rounded-lg p-8 shadow-sm">
        <div className="border-b-2 border-black pb-5 mb-8">
          <h1 className="text-2xl font-extrabold text-black tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Effective Date: November 22, 2026. Last Revised: November 2026.
          </p>
        </div>

        <div className="space-y-6 text-sm text-neutral-800 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-black mb-2">
              1. Information We Collect
            </h2>
            <p>
              ShopKaro collects information required to facilitate user authentication, catalog management, shopping cart operations, and order processing. This includes:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
              <li>
                <strong>Identity Information:</strong> Full name, verified email address, and role designation (customer, seller, or administrator).
              </li>
              <li>
                <strong>Shipping and Delivery Information:</strong> Recipient contact details and physical delivery address provided during the checkout lifecycle.
              </li>
              <li>
                <strong>Operational Logs:</strong> Inventory adjustment histories, order status modifications, and timestamped internal event triggers.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
              2. Data Protection and Cryptographic Security
            </h2>
            <p>
              All sensitive credentials within the ShopKaro database are protected with industry-standard cryptographic practices:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
              <li>
                <strong>Password Encryption:</strong> Passwords are salt-hashed using bcrypt before database insertion. Plaintext passwords are never stored or logged.
              </li>
              <li>
                <strong>Token Authentication:</strong> Stateless JSON Web Tokens (JWT) are used for short-lived access authorizations, coupled with rotatable refresh tokens stored in secure database records.
              </li>
              <li>
                <strong>Role Authorization:</strong> Server-side middleware restricts resource access based on authenticated role permissions.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
              3. Simulated Payment and Financial Data
            </h2>
            <p>
              ShopKaro is configured for educational, evaluation, and operational inventory demonstrations. Payment methods (card, upi, cash) trigger simulated settlement pipelines. ShopKaro does not collect, process, or store genuine credit card numbers, CVVs, or bank authorization tokens.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
              4. Real-Time Communications
            </h2>
            <p>
              Real-time alerts regarding order status updates and low-stock warnings are transmitted using authenticated Socket.IO connections. Messages are routed strictly to designated private user channels and are not broadcast publicly.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
              5. Data Retention and Account Rights
            </h2>
            <p>
              Users retain the right to inspect their profile records, order histories, and inventory logs. Account revocations and data purges are administered through authorized administrative endpoints.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
              6. Contact Information
            </h2>
            <p className="text-xs">
              For privacy inquiries, audit verification, or policy clarifications, contact ShopKaro Platform Compliance at security@ShopKaro.local.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
