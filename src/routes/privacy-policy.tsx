import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/privacy-policy")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div class="prose prose-zinc prose-invert max-w-4xl">
            <h1>Privacy Policy</h1>

            <p>
                <strong>Last Updated:</strong>
                {" 5th January 2026"}
                <br />
                <strong>Effective Date:</strong>
                {" 5th January 2026"}
            </p>

            <h2>1. Introduction</h2>
            <p>
                This Privacy Policy explains how Poto.nz ("we," "us," or "our") collects, uses, and protects data when you use our link shortening service (the "Service"). This policy applies
                <strong>only</strong>
                {" to data collected from:"}
            </p>
            <ul>
                <li>
                    <strong>Link Creators</strong>
                    {" (users who register accounts to create short links)"}
                </li>
                <li>
                    <strong>End-Users</strong>
                    {" who click shortened links"}
                </li>
            </ul>
            <p>
                We comply with GDPR, CCPA, and other applicable laws.
                <br />
                <strong>Note:</strong>
                {" This policy does not apply to non-account users visiting the main site without creating links."}
            </p>

            <h2>2. Data We Collect &amp; Why</h2>
            <h3>(A) Data from Link Creators (Account Holders)</h3>
            <table>
                <thead>
                    <tr>
                        <th>Data Type</th>
                        <th>Purpose</th>
                        <th>Legal Basis (GDPR)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Email Address</td>
                        <td>Create and manage your account; provide link analytics access</td>
                        <td>
                            <strong>Contractual Necessity</strong>
                            {" (to deliver the service)"}
                        </td>
                    </tr>
                    <tr>
                        <td>Short Link ID</td>
                        <td>Attribute analytics to your specific links</td>
                        <td><strong>Contractual Necessity</strong></td>
                    </tr>
                </tbody>
            </table>

            <h3>(B) Data from End-Users Clicking Short Links</h3>
            <p>
                We collect data from end-users through Cloudflare's services. Cloudflare processes the following information on our behalf for security purposes:
            </p>
            <ul>
                <li>IP Address</li>
                <li>User Agent</li>
                <li>Timestamp</li>
                <li>Referring URL</li>
                <li>Country, City, ISP</li>
                <li>Short Link ID</li>
            </ul>
            <p>
                <strong>Purpose:</strong>
            </p>
            <ul>
                <li>
                    <strong>Security:</strong>
                    {" To detect and prevent malicious activity (e.g., spam, phishing, DDoS attacks) through Cloudflare's WAF and security services"}
                </li>
                <li>
                    <strong>Analytics:</strong>
                    {" To provide anonymized aggregate statistics for link creators (e.g., \"50 clicks from Germany\")"}
                </li>
            </ul>
            <p>
                <strong>Note:</strong>
                {" We do not collect or store any personally identifiable information directly. Cloudflare processes this data on their own systems."}
            </p>

            <h2>3. Data Processing &amp; Retention</h2>
            <ul>
                <li>
                    <strong>Storage:</strong>
                    {" All data stored in Cloudflare's D1 database (US-based). Cloudflare acts only as a storage provider (not an analytics processor)."}
                </li>
                <li>
                    <strong>Retention:</strong>
                    <ul>
                        <li>
                            <strong>Cloudflare:</strong>
                            {" Retains security data (including IP addresses) for 24-48 hours per Cloudflare's standard security practices"}
                        </li>
                        <li>
                            <strong>Account Data (emails):</strong>
                            {" Retained while your account is active. Deleted within 30 days if you request account deletion."}
                        </li>
                        <li>
                            <strong>Click Data:</strong>
                            {" Automatically deleted after "}
                            <strong>1 year</strong>
                            {" from collection date. Abusive links are removed immediately with all associated data."}
                        </li>
                    </ul>
                </li>
                <li>
                    <strong>Security:</strong>
                    {" Data encrypted in transit (TLS 1.3) and at rest. Access controlled via role-based authentication and audit logs."}
                </li>
            </ul>

            <h2>4. Data Sharing</h2>
            <ul>
                <li>
                    <strong>Never shared with third parties</strong>
                    {" (e.g., advertisers, analytics tools, or data brokers)."}
                </li>
                <li>
                    <strong>Cloudflare:</strong>
                    {" Processes data on behalf of our services under the standard contractual clauses for GDPR-compliant transfers"}
                </li>
                <li>
                    <strong>Shared with link creators:</strong>
                    {" Only "}
                    <strong>anonymized aggregate data</strong>
                    {" (e.g., \"50 clicks from Japan\"). "}
                    <strong>Individual clicker data (including user agents or IPs) is never shared.</strong>
                </li>
            </ul>

            <h2>5. Your Rights</h2>
            <h3>(A) For Link Creators (Account Holders)</h3>
            <ul>
                <li>
                    <strong>Account Deletion:</strong>
                    {" Request deletion of your account (including email and analytics) via "}
                    <a href="mailto:account@poto.nz">account@poto.nz</a>
                    {" . We process requests within 30 days."}
                </li>
                <li>
                    <strong>Data Access:</strong>
                    {" Request copies of your stored data."}
                </li>
            </ul>

            <h3>(B) For End-Users Clicking Links</h3>
            <ul>
                <li>
                    <strong>No individual data is stored.</strong>
                    {" We "}
                    <strong>cannot process deletion requests</strong>
                    {" for clicker data because:"}
                    <ul>
                        <li>No IP, email, or user ID is linked to specific click records</li>
                        <li>Data is anonymized and aggregated before any reporting</li>
                    </ul>
                </li>
                <li>
                    <strong>If you believe we mistakenly collected your PII</strong>
                    , contact us at
                    {" "}
                    <a href="mailto:privacy@poto.nz">privacy@poto.nz</a>
                    {" . We will verify and delete if applicable."}
                </li>
            </ul>

            <h2>6. Handling Malicious Links</h2>
            <p>
                {"We automatically remove links used for illegal activity (e.g., phishing). All associated data (country, city, ISP) is deleted within "}
                <strong>24 hours</strong>
                {" of removal."}
            </p>

            <h2>7. Contact Us</h2>
            <ul>
                <li>
                    <strong>For link creators:</strong>
                    {" Email "}
                    <a href="mailto:privacy@poto.nz">privacy@poto.nz</a>
                    {" for account deletion/data requests."}
                </li>
                <li>
                    <strong>For clickers:</strong>
                    {" Email "}
                    <a href="mailto:privacy@poto.nz">privacy@poto.nz</a>
                    {" to report potential PII errors."}
                </li>
            </ul>
        </div>
    );
}
