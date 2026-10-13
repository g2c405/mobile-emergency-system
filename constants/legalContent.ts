export type LegalDocumentType = "terms" | "privacy";

export interface LegalSection {
    heading: string;
    body: string;
}

export interface LegalDocumentContent {
    title: string;
    subtitle: string;
    lastUpdated: string;
    sections: LegalSection[];
    closingStatement: string;
}

const projectTitle =
    "Mobile App Emergency Response Notification in Angeles City with Data Analytics";

export const legalContent: Record<
    LegalDocumentType,
    LegalDocumentContent
> = {
    terms: {
        title: "Terms and Conditions",
        subtitle: projectTitle,
        lastUpdated: "October 2026",
        sections: [
            {
                heading: "1. Acceptance of Terms",
                body:
                    "By registering for or using this application, users agree to comply with these Terms and Conditions. Users who do not agree to these terms should discontinue using the application.",
            },
            {
                heading: "2. Account Management",
                body:
                    "Users must provide accurate and up-to-date information when creating and managing their accounts. Users are responsible for keeping their login credentials confidential and for all activities performed through their accounts. Users must immediately report any suspected unauthorized access to their accounts.",
            },
            {
                heading: "3. Accident Reporting",
                body:
                    "Users may submit accident reports by providing the GPS location, barangay name, photo or video evidence, and additional incident details. Users must ensure that the information submitted is accurate and truthful. Submitting false, misleading, or intentionally fabricated reports is prohibited.",
            },
            {
                heading: "4. Notification and Alerts",
                body:
                    "The application provides notifications and updates regarding the status of submitted accident reports. Notification delivery may be affected by internet connectivity, device settings, or technical issues. Users should not assume that a submitted report has been received or acted upon unless the application provides an appropriate confirmation or status update.",
            },
            {
                heading: "5. History Management",
                body:
                    "The application stores and displays users' submitted accident reports, including report details and status history. Access to report history is intended to help users monitor their submissions. The availability and retention of records are subject to the application's data management policies.",
            },
            {
                heading: "6. Location and Media Permissions",
                body:
                    "Users may need to grant location and media access permissions to submit accident reports. Location information, photos, and videos should be relevant to the reported incident. Users should avoid submitting unnecessary personal information or media that violates another person's privacy.",
            },
            {
                heading: "7. Data Privacy and Analytics",
                body:
                    "Information collected through the application may be processed to support accident reporting, notification services, record management, and data analytics. Access to personal information must be limited to authorized purposes and handled in accordance with the application's Privacy Policy and applicable data protection laws.",
            },
            {
                heading: "8. Responsible Use",
                body:
                    "Users must not misuse the application, interfere with its operations, attempt unauthorized access, or submit fraudulent reports. The application must be used responsibly and only for its intended purposes.",
            },
            {
                heading: "9. Limitations of the Application",
                body:
                    "The application serves as a tool for accident reporting and emergency notification. It does not guarantee immediate assistance, successful notification delivery, or a specific response time. Users should contact the appropriate emergency services directly when immediate assistance is required.",
            },
            {
                heading: "10. Application Updates and Availability",
                body:
                    "The developers may update, modify, or temporarily suspend application features for maintenance, security, or improvement purposes. Some features may become unavailable due to technical issues or circumstances beyond the developers' control.",
            },
            {
                heading: "11. Changes to the Terms and Conditions",
                body:
                    "These Terms and Conditions may be updated when necessary. Users will be informed of significant changes through the application or other appropriate means.",
            },
            {
                heading: "12. Contact Information",
                body:
                    "Users may contact the application administrators through the official contact information provided within the application for questions, concerns, or issues related to these Terms and Conditions.",
            },
        ],
        closingStatement:
            "By continuing to use the application, users acknowledge that they have read and agreed to these Terms and Conditions.",
    },

    privacy: {
        title: "Privacy Policy",
        subtitle: projectTitle,
        lastUpdated: "October 2026",
        sections: [
            {
                heading: "1. Introduction",
                body:
                    "This Privacy Policy explains how the Mobile App Emergency Response Notification in Angeles City with Data Analytics collects, uses, stores, and protects users' personal information. We respect the privacy of our users and are committed to handling their information responsibly in accordance with applicable data protection laws.",
            },
            {
                heading: "2. Information We Collect",
                body:
                    "The application may collect the following information when residents use its features:\n\nAccount Information: Information provided during registration and profile management, such as name, email address, contact details, and login credentials, depending on the fields required by the application.\n\nLocation Information: GPS coordinates and barangay information submitted with accident reports.\n\nAccident Report Information: Incident descriptions, dates, times, and other details provided by users.\n\nPhoto and Video Evidence: Images and videos voluntarily uploaded as supporting evidence for accident reports.\n\nReport History: Records of submitted reports, including report details and status updates.\n\nTechnical Information: Limited information about application usage and technical performance, if collected by the system.",
            },
            {
                heading: "3. How We Use Your Information",
                body:
                    "The information collected may be used to:\n\n• Create and manage user accounts.\n• Receive and process accident reports.\n• Identify the reported accident location.\n• Provide notifications and updates regarding report status.\n• Maintain a history of submitted reports.\n• Generate statistical reports and data analytics related to accident incidents.\n• Monitor and improve the application's functionality and performance.",
            },
            {
                heading: "4. Location and Media Access",
                body:
                    "The application may request permission to access the device's location and allow users to upload photos or videos. Location information is used to identify the reported incident's location, while media files serve as supporting evidence. Access to these features depends on the permissions granted by the user and the application's actual functionality.",
            },
            {
                heading: "5. Data Sharing and Disclosure",
                body:
                    "Accident reports submitted through the application may only be accessed by authorized barangay personnel assigned to the barangay where the incident was reported. These personnel may review the accident details, GPS location, barangay name, and uploaded photo or video evidence for purposes of reviewing, managing, and monitoring reported incidents.\n\nAuthorized personnel may update the status of reports to provide residents with information about the progress of their submissions. Personnel are expected to access and process report information only for legitimate duties related to the application.\n\nAccident reports will not be accessible to personnel from unrelated barangays unless access is properly authorized for a legitimate purpose. Information may be shared with appropriate authorities when necessary and permitted by applicable.",
            },
            {
                heading: "6. Data Analytics",
                body:
                    "The application may analyze accident reports to identify incident patterns, locations, frequencies, and other relevant trends. These analyses are intended to support accident monitoring, reporting, and data-informed decision-making.\n\nWhere possible, aggregated or de-identified data should be used for analytical reports to reduce the exposure of personal information.",
            },
            {
                heading: "7. Data Storage and Security",
                body:
                    "The application will use appropriate organizational, physical, and technical safeguards to protect personal information against unauthorized access, disclosure, alteration, loss, or misuse. Access to stored information should be restricted to authorized individuals with legitimate responsibilities.\n\nHowever, no electronic storage or data transmission method can be guaranteed to be completely secure.",
            },
            {
                heading: "8. Data Retention",
                body:
                    "Personal information, accident reports, media files, and report histories may be retained for as long as necessary to fulfill the application's purposes and comply with applicable legal or operational requirements. Records should be securely disposed of or anonymized when they are no longer necessary, subject to applicable retention requirements.",
            },
            {
                heading: "9. User Rights",
                body:
                    "Subject to applicable laws and legal limitations, users may have the right to:\n\n• Be informed about how their personal information is processed.\n• Access their personal information.\n• Request correction of inaccurate or incomplete information.\n• Object to certain forms of processing or request the deletion or blocking of information where legally applicable.\n• Raise concerns or file a complaint regarding the handling of their personal information.\n\nUsers may submit privacy-related requests to the designated application administrator.",
            },
            {
                heading: "10. Third-Party Services",
                body:
                    "The application may use third-party services for functions such as hosting, maps, notifications, or data storage, depending on its implementation. These services may process information as necessary to provide their functions. Their involvement and applicable privacy practices should be disclosed where relevant.",
            },
            {
                heading: "11. Children's Privacy",
                body:
                    "The application is intended for its designated users. If children are permitted to use the application, appropriate safeguards and any legally required consent or authorization must be implemented before collecting their personal information.",
            },
            {
                heading: "12. Changes to This Privacy Policy",
                body:
                    "This Privacy Policy may be updated to reflect changes in application features, data processing practices, or legal requirements. Significant changes should be communicated through the application or other appropriate channels.",
            },
            {
                heading: "13. Contact Information",
                body:
                    "For questions, requests, or complaints concerning personal information, users may contact:\n\nApplication Administrator: Aaron Paul Duya\n\nEmail Address: apduya23-0123@cca.edu.ph\n\nUsers may also contact the Philippine National Privacy Commission through its official channels for information about their data privacy rights.",
            },
        ],
        closingStatement:
            "By using the application, users acknowledge that they have been informed of the privacy practices described in this policy. Where consent is the appropriate legal basis for a specific processing activity, that consent must be obtained separately and appropriately.",
    },
};