const PdfPrinter = require('pdfmake');
const { jsPDF } = require('jspdf');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// ══════ Load Roboto Fonts from pdfmake's vfs_fonts ══════
function loadFonts() {
  try {
    const vfsFonts = require('pdfmake/build/vfs_fonts');
    const vfs = (vfsFonts.pdfMake && vfsFonts.pdfMake.vfs) || vfsFonts;
    if (!vfs['Roboto-Regular.ttf']) throw new Error('Roboto not found in vfs');
    console.log('Roboto fonts loaded successfully.');
    return {
      fonts: {
        Roboto: {
          normal: Buffer.from(vfs['Roboto-Regular.ttf'], 'base64'),
          bold: Buffer.from(vfs['Roboto-Medium.ttf'], 'base64'),
          italics: Buffer.from(vfs['Roboto-Italic.ttf'], 'base64'),
          bolditalics: Buffer.from(vfs['Roboto-MediumItalic.ttf'], 'base64')
        }
      },
      fontName: 'Roboto'
    };
  } catch (e) {
    console.warn('Roboto not available, falling back to Helvetica:', e.message);
    return {
      fonts: {
        Helvetica: {
          normal: 'Helvetica',
          bold: 'Helvetica-Bold',
          italics: 'Helvetica-Oblique',
          bolditalics: 'Helvetica-BoldOblique'
        }
      },
      fontName: 'Helvetica'
    };
  }
}

const { fonts, fontName } = loadFonts();
const printer = new PdfPrinter(fonts);

// ══════ Config ══════
const CONFIG = {
  name: 'Goh Siang Wei',
  position: 'IT Service / IT Support',
  company: 'Li Chuan Food Products (Vietnam) Co., Ltd',
  ic: 'S9183037Z',
  bank: 'OCBC',
  account: '643-405103-001',
  currency: 'SGD',
  amount: 1540.00,
  signatureUrl: 'https://jbpvqlvlokvqpkulisxi.supabase.co/storage/v1/object/public/signatures/SW.png'
};

// ══════ Helpers ══════
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const pick = (a, n) => [...a].sort(() => Math.random() - 0.5).slice(0, n);
const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pad = (n) => String(n).padStart(2, '0');

function getTargetMonth() {
  const now = new Date();
  let month = now.getMonth() - 1;
  let year = now.getFullYear();
  if (month < 0) { month = 11; year--; }
  const lastDay = new Date(year, month + 1, 0).getDate();
  return { year, month, lastDay };
}

function randDates(count, year, month) {
  const lastDay = new Date(year, month + 1, 0).getDate();
  const dates = [];
  for (let i = 0; i < count; i++) {
    dates.push(`${year}-${pad(month + 1)}-${pad(randInt(1, lastDay))}`);
  }
  return dates.sort();
}

function fmtDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

// ══════ Fetch signature image ══════
async function fetchSignature(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    return 'data:image/png;base64,' + buffer.toString('base64');
  } catch (e) {
    console.warn('Could not load signature:', e.message);
    return null;
  }
}

// ══════ Generate PDF buffer from pdfmake doc definition ══════
function generatePdfBuffer(docDefinition) {
  return new Promise((resolve, reject) => {
    const doc = printer.createPdfKitDocument(docDefinition);
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.end();
  });
}

// ══════════════════════════════════════════════════════════════
// ══════ DATA POOLS (same as index.html) ══════
// ══════════════════════════════════════════════════════════════

const s1Pool = [
  {desc:'Developed new Purchase Order module with approval workflow logic',sys:'ERP System',status:'Completed'},
  {desc:'Fixed calculation error in production cost report module',sys:'ERP System',status:'Resolved'},
  {desc:'Created new inventory adjustment form with audit trail logging',sys:'ERP - Inventory Module',status:'Completed'},
  {desc:'Modified Sales Order logic to auto-calculate discount based on customer tier',sys:'ERP - Sales Module',status:'Completed'},
  {desc:'Built monthly production summary report with export to Excel function',sys:'ERP - Reporting',status:'Completed'},
  {desc:'Reviewed and corrected duplicate entries in raw material master data',sys:'ERP - Database',status:'Completed'},
  {desc:'Developed Goods Received Note (GRN) module linked to Purchase Order',sys:'ERP System',status:'Completed'},
  {desc:'Updated BOM (Bill of Materials) logic to support multi-level components',sys:'ERP - Production Module',status:'Completed'},
  {desc:'Fixed bug where stock quantity showed negative after batch adjustment',sys:'ERP - Inventory Module',status:'Resolved'},
  {desc:'Created user role permission matrix for warehouse staff access control',sys:'ERP - Admin Module',status:'Completed'},
  {desc:'Built dashboard showing daily production output vs target KPI',sys:'ERP - Dashboard',status:'Completed'},
  {desc:'Modified invoice generation logic to include tax calculation for Vietnam regulations',sys:'ERP - Accounting Module',status:'Completed'},
  {desc:'Audited database for incorrect product pricing entries and corrected them',sys:'ERP - Database',status:'Completed'},
  {desc:'Developed batch tracking module for raw material traceability',sys:'ERP - Quality Module',status:'Completed'},
  {desc:'Fixed issue where production order status not updating after completion',sys:'ERP - Production Module',status:'Resolved'},
  {desc:'Created automated stock reorder alert when inventory falls below minimum level',sys:'ERP - Inventory Module',status:'Completed'},
  {desc:'Built supplier performance report based on delivery time and quality data',sys:'ERP - Purchasing Module',status:'Completed'},
  {desc:'Reviewed user input data in Sales module, found and corrected wrong unit prices',sys:'ERP - Sales Module',status:'Completed'},
  {desc:'Developed delivery order printout with barcode for warehouse scanning',sys:'ERP - Logistics Module',status:'Completed'},
  {desc:'Optimized slow database query in inventory report, reduced load time from 30s to 3s',sys:'ERP - Database',status:'Completed'},
  {desc:'Added new fields to customer master data for credit limit and payment terms',sys:'ERP - Sales Module',status:'Completed'},
  {desc:'Fixed rounding error in weight conversion between kg and ton in production module',sys:'ERP - Production Module',status:'Resolved'},
  {desc:'Created warehouse location management module with bin/rack assignment',sys:'ERP - Warehouse Module',status:'Completed'},
  {desc:'Monitored daily data entry by warehouse staff, corrected wrong quantity inputs',sys:'ERP - Inventory Module',status:'Completed'},
  {desc:'Built employee attendance integration module linking to fingerprint system',sys:'ERP - HR Module',status:'Completed'},
  {desc:'Developed raw material consumption report by production batch',sys:'ERP - Reporting',status:'Completed'},
  {desc:'Fixed logic error in FIFO costing method for finished goods valuation',sys:'ERP - Accounting Module',status:'Resolved'},
  {desc:'Created Quality Control checklist module for incoming raw materials',sys:'ERP - Quality Module',status:'Completed'},
  {desc:'Modified production planning module to support weekly scheduling view',sys:'ERP - Production Module',status:'Completed'},
  {desc:'Checked and cleaned up orphan records in transaction database tables',sys:'ERP - Database',status:'Completed'},
  {desc:'Built customer outstanding balance report with aging analysis',sys:'ERP - Accounting Module',status:'Completed'},
  {desc:'Developed stock transfer module between warehouse locations',sys:'ERP - Inventory Module',status:'Completed'},
  {desc:'Fixed permission bug where users could edit locked/approved purchase orders',sys:'ERP - Admin Module',status:'Resolved'},
  {desc:'Created product label printing function with QR code from ERP data',sys:'ERP - Production Module',status:'Completed'},
  {desc:'Reviewed production data entries, corrected mismatched batch numbers',sys:'ERP - Production Module',status:'Completed'},
  {desc:'Built automated monthly closing process for inventory valuation',sys:'ERP - Accounting Module',status:'Completed'},
  {desc:'Developed machine maintenance scheduling module with notification alerts',sys:'ERP - Maintenance Module',status:'Completed'},
  {desc:'Fixed date format inconsistency issue across different ERP modules',sys:'ERP System',status:'Resolved'},
  {desc:'Created packing list module linked to Sales Order and Delivery Order',sys:'ERP - Logistics Module',status:'Completed'},
  {desc:'Audited accounting entries for month-end, identified and fixed posting errors',sys:'ERP - Accounting Module',status:'Completed'},
  {desc:'Built raw material price comparison report across multiple suppliers',sys:'ERP - Purchasing Module',status:'Completed'},
  {desc:'Developed container loading plan module for export shipments',sys:'ERP - Logistics Module',status:'Completed'},
  {desc:'Fixed issue where ERP report export to PDF was cutting off table columns',sys:'ERP - Reporting',status:'Resolved'},
  {desc:'Created finished goods shelf-life tracking with expiry date alerts',sys:'ERP - Quality Module',status:'Completed'},
  {desc:'Modified Purchase Request approval workflow to include department head sign-off',sys:'ERP - Purchasing Module',status:'Completed'},
  {desc:'Reviewed warehouse staff stock-in data, corrected entries with wrong lot numbers',sys:'ERP - Inventory Module',status:'Completed'},
  {desc:'Built production yield analysis report comparing actual vs standard output',sys:'ERP - Reporting',status:'Completed'},
  {desc:'Developed vendor payment tracking module with due date reminders',sys:'ERP - Accounting Module',status:'Completed'},
  {desc:'Fixed bug where deleting a line item in Sales Order did not recalculate total',sys:'ERP - Sales Module',status:'Resolved'},
  {desc:'Created inter-department material request and approval module',sys:'ERP System',status:'Completed'},
  {desc:'Optimized database indexes on frequently queried inventory tables',sys:'ERP - Database',status:'Completed'},
  {desc:'Built production downtime logging module for machine efficiency tracking',sys:'ERP - Production Module',status:'Completed'},
  {desc:'Reviewed and corrected wrong supplier codes linked to purchase transactions',sys:'ERP - Database',status:'Completed'},
  {desc:'Developed sample request tracking module for R&D department',sys:'ERP - R&D Module',status:'Completed'},
  {desc:'Fixed currency conversion logic for foreign supplier invoices',sys:'ERP - Accounting Module',status:'Resolved'},
  {desc:'Created daily production input form with validation rules to prevent wrong entries',sys:'ERP - Production Module',status:'Completed'},
  {desc:'Built document attachment feature for Purchase Orders and invoices',sys:'ERP System',status:'Completed'},
  {desc:'Monitored ERP system performance, identified and resolved slow module loading',sys:'ERP - Database',status:'Resolved'},
  {desc:'Developed waste/scrap recording module linked to production batches',sys:'ERP - Production Module',status:'Completed'},
  {desc:'Created data backup verification report and tested database restore procedure',sys:'ERP - Database',status:'Completed'},
];

const s2Pool = [
  {sys:'ERP - Database',work:'Performed monthly database optimization, rebuilt indexes and cleared temp tables',status:'Completed'},
  {sys:'ERP System',work:'Deployed latest system patches and bug fixes to production server',status:'Updated'},
  {sys:'ERP - Database',work:'Verified daily automated backup and tested data restore procedure',status:'Normal'},
  {sys:'ERP - Admin Module',work:'Reviewed user access permissions, deactivated unused accounts',status:'Completed'},
  {sys:'ERP - Reporting',work:'Optimized report generation queries to improve loading speed',status:'Optimized'},
  {sys:'ERP - Database',work:'Monitored database disk space usage and archived old transaction logs',status:'Healthy'},
  {sys:'ERP System',work:'Checked all module functionalities after server maintenance window',status:'Operational'},
  {sys:'ERP - Database',work:'Ran data integrity check across all master data tables',status:'Completed'},
  {sys:'ERP - Inventory Module',work:'Reconciled physical stock count with system records and adjusted differences',status:'Completed'},
  {sys:'ERP System',work:'Updated SSL certificate and security configurations on ERP web server',status:'Updated'},
  {sys:'ERP - Database',work:'Cleaned up duplicate records and orphan data in transaction tables',status:'Completed'},
  {sys:'ERP - Accounting Module',work:'Performed month-end closing procedures and verified posting accuracy',status:'Completed'},
  {sys:'ERP System',work:'Monitored system uptime and server resource utilization throughout the month',status:'Stable'},
  {sys:'ERP - Production Module',work:'Reviewed production workflow configurations and corrected routing errors',status:'Completed'},
  {sys:'ERP - Database',work:'Performed full database backup before scheduled system upgrade',status:'Completed'},
  {sys:'ERP - Admin Module',work:'Updated password policy and enforced multi-factor authentication for admin users',status:'Completed'},
  {sys:'ERP System',work:'Tested disaster recovery plan with simulated failover to backup server',status:'Tested'},
  {sys:'ERP - Reporting',work:'Reviewed and updated automated report scheduling for management dashboards',status:'Updated'},
  {sys:'ERP - Database',work:'Migrated archived data to cold storage to free up primary database space',status:'Completed'},
  {sys:'ERP System',work:'Conducted system health check and documented performance baseline metrics',status:'Normal'},
  {sys:'ERP - Production Module',work:'Validated production order auto-numbering logic after sequence gap reported',status:'Completed'},
  {sys:'ERP - Inventory Module',work:'Performed cycle count reconciliation and corrected variance entries in system',status:'Completed'},
  {sys:'Tablet - Production Floor',work:'Updated tablet firmware and ERP mobile app to latest stable version',status:'Updated'},
  {sys:'Tablet - Warehouse',work:'Replaced damaged tablet screen protector and recalibrated barcode scanner',status:'Completed'},
  {sys:'ERP - Purchasing Module',work:'Reviewed supplier lead time settings and updated reorder point calculations',status:'Updated'},
  {sys:'ERP - Admin Module',work:'Audited user login history and flagged dormant accounts for deactivation',status:'Completed'},
  {sys:'ERP - Database',work:'Performed scheduled index defragmentation on high-traffic transaction tables',status:'Optimized'},
  {sys:'Tablet - QC Station',work:'Configured quality inspection checklist forms on QC tablets for new product line',status:'Completed'},
  {sys:'ERP System',work:'Verified system clock synchronization across all ERP servers and client machines',status:'Normal'},
  {sys:'ERP - Reporting',work:'Created new monthly KPI dashboard for production yield and downtime tracking',status:'Completed'},
  {sys:'ERP - Database',work:'Reviewed database transaction log growth and adjusted auto-shrink settings',status:'Optimized'},
  {sys:'ERP - Production Module',work:'Corrected BOM version control logic to prevent outdated recipes from being used',status:'Completed'},
  {sys:'Tablet - Maintenance',work:'Deployed preventive maintenance checklist app on technician tablets',status:'Completed'},
  {sys:'ERP - Accounting Module',work:'Reconciled intercompany transaction records and corrected posting discrepancies',status:'Completed'},
  {sys:'ERP System',work:'Conducted quarterly ERP license compliance review and documented active user count',status:'Completed'},
  {sys:'ERP - Inventory Module',work:'Reviewed and corrected warehouse bin location mapping in system',status:'Updated'},
  {sys:'Tablet - Production Floor',work:'Tested tablet Wi-Fi connectivity stability in production area and repositioned access point',status:'Completed'},
  {sys:'ERP - Admin Module',work:'Configured role-based access control for new department users following approval matrix',status:'Completed'},
  {sys:'ERP - Database',work:'Executed full integrity check on all database tables and repaired minor inconsistencies',status:'Healthy'},
  {sys:'ERP - Production Module',work:'Reviewed production scheduling logic and adjusted capacity planning parameters',status:'Updated'},
  {sys:'Tablet - Warehouse',work:'Enrolled new warehouse tablets into mobile device management system for remote monitoring',status:'Completed'},
  {sys:'ERP System',work:'Performed end-to-end testing of order-to-delivery workflow after module update',status:'Tested'},
  {sys:'ERP - Reporting',work:'Automated raw material consumption report and scheduled daily email distribution',status:'Completed'},
  {sys:'ERP - Database',work:'Set up database performance monitoring alerts for CPU and memory threshold breaches',status:'Active'},
];

const s3Pool = [
  {issue:'ERP system running slow during peak hours with multiple concurrent users',action:'Optimized database queries, increased server memory allocation, and added connection pooling',result:'Resolved'},
  {issue:'Production module showing incorrect BOM quantities after recent update',action:'Rolled back logic change, corrected formula and redeployed the fix',result:'Resolved'},
  {issue:'Users reported inventory count mismatch between ERP and physical stock',action:'Audited transaction logs, found unapproved adjustments, corrected entries and retrained staff',result:'Resolved'},
  {issue:'ERP report exporting blank pages when generating PDF for large datasets',action:'Fixed pagination logic and increased memory buffer for report generation',result:'Resolved'},
  {issue:'Sales Order approval workflow stuck, orders not moving to next approval stage',action:'Identified misconfigured approval rule, corrected workflow routing logic',result:'Resolved'},
  {issue:'Database connection timeout errors during month-end closing process',action:'Increased connection timeout setting, optimized closing stored procedures',result:'Resolved'},
  {issue:'Wrong unit price pulled into Purchase Order from outdated supplier price list',action:'Updated supplier price master data, added validation check before PO creation',result:'Resolved'},
  {issue:'Production staff entered wrong batch numbers causing traceability data errors',action:'Corrected batch records in database, implemented barcode scanning to prevent manual errors',result:'Resolved'},
  {issue:'ERP dashboard not refreshing data, showing yesterday figures',action:'Fixed scheduled job that was failing silently, restarted data sync service',result:'Resolved'},
  {issue:'Duplicate customer records found in master data causing invoice confusion',action:'Merged duplicate records, reassigned linked transactions, added duplicate check on creation',result:'Resolved'},
  {issue:'Accounting module posting entries to wrong fiscal period after year-end',action:'Corrected fiscal period configuration and reposted affected transactions',result:'Resolved'},
  {issue:'Warehouse staff unable to print delivery orders from ERP system',action:'Fixed printer mapping configuration in ERP settings, updated print template',result:'Resolved'},
  {issue:'ERP backup job failed overnight due to insufficient disk space',action:'Freed disk space by archiving old logs, expanded backup storage, verified next backup success',result:'Resolved'},
  {issue:'GRN module not deducting quantity from open Purchase Order correctly',action:'Found logic error in partial receipt calculation, patched and tested the fix',result:'Resolved'},
  {issue:'User accidentally approved a wrong Purchase Order with inflated quantities',action:'Reversed the PO approval, corrected quantities, added confirmation prompt before approval',result:'Resolved'},
  {issue:'Inventory valuation report showing negative cost for certain items',action:'Traced to incorrect stock adjustment entry, corrected cost records and recalculated valuation',result:'Resolved'},
  {issue:'ERP login page not loading after server restart',action:'Web service did not auto-start, configured auto-start and restarted the service manually',result:'Resolved'},
  {issue:'Production schedule module conflicting when two users edit same order',action:'Implemented record locking mechanism to prevent concurrent edit conflicts',result:'Resolved'},
  {issue:'Wrong tax rate applied to domestic invoices after tax regulation update',action:'Updated tax rate configuration in accounting module and regenerated affected invoices',result:'Resolved'},
  {issue:'Data import from Excel failing due to format mismatch in date columns',action:'Standardized date format in import template and added format validation before import',result:'Resolved'},
  {issue:'Tablet unable to connect to ERP server after network maintenance',action:'Updated Wi-Fi configuration on affected tablets and verified ERP server endpoint accessibility',result:'Resolved'},
  {issue:'Production module auto-calculation logic returning wrong yield percentage',action:'Reviewed formula logic, found rounding error in batch size division, corrected and redeployed',result:'Resolved'},
  {issue:'Warehouse tablet barcode scanner failing to read damaged labels',action:'Replaced worn-out scanner module, updated scan tolerance settings and printed new labels',result:'Resolved'},
  {issue:'ERP approval routing skipping supervisor level for high-value purchase orders',action:'Corrected approval threshold logic in workflow configuration to include supervisor tier',result:'Resolved'},
  {issue:'Maintenance work order module not sending notification to assigned technician',action:'Fixed email trigger condition in workflow rule and verified SMTP relay settings',result:'Resolved'},
  {issue:'Stock transfer between warehouses not reflecting in destination location',action:'Found pending sync job stuck in queue, cleared queue and reprocessed transfer transactions',result:'Resolved'},
  {issue:'QC tablet app crashing when uploading inspection photos larger than 5MB',action:'Added image compression before upload and increased server file size limit',result:'Resolved'},
  {issue:'ERP costing module calculating wrong standard cost due to outdated exchange rate',action:'Updated exchange rate table, recalculated standard costs and adjusted variance entries',result:'Resolved'},
  {issue:'User role permission logic allowing view access to restricted financial reports',action:'Audited permission matrix, corrected role inheritance logic and removed unauthorized access',result:'Resolved'},
  {issue:'Production floor tablet losing session and requiring frequent re-login',action:'Extended session timeout for production role and enabled persistent login token on tablets',result:'Resolved'},
  {issue:'ERP scheduled maintenance job running during business hours causing slowdown',action:'Rescheduled maintenance window to off-peak hours and added server load monitoring',result:'Resolved'},
  {issue:'Inventory reorder point logic not triggering purchase requisition for new items',action:'Found new items missing lead time and safety stock parameters, configured and tested',result:'Resolved'},
  {issue:'Supervisor dashboard showing incorrect headcount after department restructure',action:'Updated organizational structure in ERP admin module and refreshed dashboard data source',result:'Resolved'},
  {issue:'ERP audit trail log not capturing changes made through batch update function',action:'Enabled change tracking on batch update stored procedure and verified log entries',result:'Resolved'},
  {issue:'Tablet thermal shutdown during prolonged use in non-air-conditioned warehouse',action:'Installed tablet cooling mounts at workstations and adjusted screen brightness to reduce heat',result:'Resolved'},
  {issue:'Purchase order approval logic not enforcing budget limit check for certain cost centers',action:'Added budget validation rule to approval workflow for all cost centers without exception',result:'Resolved'},
  {issue:'ERP production module showing phantom work orders from cancelled sales orders',action:'Corrected cascading cancellation logic to include linked production orders',result:'Resolved'},
  {issue:'Maintenance scheduling module double-booking equipment for preventive maintenance',action:'Fixed date overlap validation logic in scheduling algorithm and cleared duplicate entries',result:'Resolved'},
  {issue:'ERP system generating duplicate sequential document numbers under high load',action:'Implemented database-level sequence lock to prevent race condition in number generation',result:'Resolved'},
  {issue:'Supervisor unable to view subordinate leave requests in ERP HR module',action:'Corrected reporting hierarchy mapping and refreshed supervisor permission cache',result:'Resolved'},
  {issue:'Warehouse tablet GPS location tracking draining battery within 4 hours',action:'Changed location polling interval from 30 seconds to 5 minutes, battery now lasts full shift',result:'Resolved'},
  {issue:'ERP MRP logic suggesting purchase for items with sufficient existing stock',action:'Found safety stock parameter set too high, adjusted to realistic level and re-ran MRP',result:'Resolved'},
  {issue:'Month-end inventory valuation logic using wrong costing method for raw materials',action:'Corrected costing method from FIFO to weighted average as per accounting policy',result:'Resolved'},
  {issue:'Tablet sync failing silently when ERP server SSL certificate expired',action:'Renewed SSL certificate, updated certificate trust store on all tablets',result:'Resolved'},
];

const s4Pool = [
  'ERP system performance is stable this month. Database optimization has improved report loading speed significantly.',
  'Recommend conducting a quarterly data audit to catch input errors early before they affect reports.',
  'Suggest scheduling ERP training for new warehouse staff to reduce data entry mistakes.',
  'Ongoing development of new modules is on track. Will prioritize production planning module next month.',
  'Database backup and recovery procedures have been tested successfully. No issues found.',
  'Recommend implementing barcode scanning at all data entry points to minimize manual input errors.',
  'Suggest upgrading the ERP database server hardware to support growing transaction volume.',
  'All reported ERP bugs have been resolved this month. System is stable for daily operations.',
  'Recommend adding data validation rules to prevent common input mistakes by operators.',
  'ERP user access review completed. Removed unnecessary admin privileges from 3 accounts.',
  'Suggest creating a standard operating procedure (SOP) document for all ERP modules.',
  'Plan to develop a mobile-friendly ERP dashboard for management to view KPIs on the go.',
  'Recommend periodic review of ERP workflows to ensure they still match actual business processes.',
  'Database storage usage is at 65%. Plan to archive data older than 2 years next quarter.',
  'Suggest implementing automated email notifications for key ERP events like PO approvals and stock alerts.',
  'Tablet devices on the production floor are functioning well. Scheduled firmware update for next maintenance window.',
  'Recommend implementing a supervisory review step for all manual stock adjustments exceeding 100 units.',
  'ERP production scheduling logic has been refined. Capacity utilization improved by approximately 12% this month.',
  'Suggest deploying additional tablets at receiving dock to speed up GRN processing and reduce paper forms.',
  'Maintenance module usage has increased. Recommend training session for technicians on advanced work order features.',
  'ERP approval workflow logic reviewed and tightened. All purchase orders above RM5000 now require dual approval.',
  'Recommend quarterly review of ERP user roles to ensure compliance with internal access control policy.',
  'Tablet battery health check completed. Two units showing degraded capacity flagged for battery replacement.',
  'Database maintenance procedures are running smoothly. Consider upgrading to SSD storage for faster query performance.',
  'Suggest adding real-time inventory dashboard on warehouse tablets to reduce stock inquiry calls to office.',
  'ERP system uptime was 99.7% this month. Single downtime event was planned maintenance on database server.',
  'Recommend implementing automated alerts when ERP scheduled jobs fail to complete within expected timeframe.',
  'Supervisory audit of ERP data entry accuracy shows improvement. Error rate dropped from 3.2% to 1.8%.',
  'Plan to integrate tablet-based digital signatures for delivery confirmation to replace paper sign-off process.',
  'ERP costing logic for semi-finished goods has been validated against manual calculations. No discrepancies found.',
  'Suggest setting up a staging environment to test ERP updates before deploying to production system.',
  'Maintenance work order backlog has been cleared. Recommend setting up weekly review meeting with maintenance supervisor.',
  'Tablet deployment at QC stations has reduced inspection report turnaround time from 2 hours to 30 minutes.',
  'Recommend adding logic validation to prevent negative stock quantities from being posted in inventory module.',
  'ERP system monitoring dashboard has been configured. IT team now receives alerts for abnormal system behavior.',
  'Suggest conducting annual disaster recovery drill to verify ERP backup and restore procedures work correctly.',
  'Production supervisors now have read-only access to scheduling module on tablets for real-time floor monitoring.',
  'Recommend reviewing ERP license allocation as current active users are at 85% of licensed capacity.',
  'Tablet MDM enrollment completed for all devices. Remote wipe and lock capabilities are now available for security.',
  'ERP integration logic between purchasing and inventory modules tested successfully after recent patch update.',
];

// ══════════════════════════════════════════════════════════════
// ══════ IT SERVICE REPORT (pdfmake + Roboto) ══════
// ══════════════════════════════════════════════════════════════

function generateITReport(info, signatureBase64) {
  const { year, month, lastDay } = info;
  const period = `${months[month]} ${year}`;
  const serviceNo = `IT-${year}${pad(month + 1)}-${String(Math.floor(Math.random() * 900000) + 100000)}`;
  const sigDateStr = `${year}-${pad(month + 1)}-${pad(lastDay)}`;
  const sigDate = fmtDate(sigDateStr);

  const s1Count = randInt(1, 2), s1Items = pick(s1Pool, s1Count), s1Dates = randDates(s1Count, year, month);
  const s2Count = randInt(1, 2), s2Items = pick(s2Pool, s2Count);
  const s3Count = randInt(1, 2), s3Items = pick(s3Pool, s3Count);
  const notes = pick(s4Pool, 1)[0];

  const P = '#1a5276', G = '#95a5a6';
  const sH = (t) => ({ text: t, fontSize: 11, bold: true, color: P, margin: [0, 12, 0, 5], background: '#eaf2f8' });
  const th = (t) => ({ text: t, bold: true, fontSize: 8.5, color: '#fff', fillColor: P, alignment: 'center', margin: [0, 3] });
  const td = (t, o) => Object.assign({ text: t || '', fontSize: 8.5, margin: [2, 3] }, o || {});
  const tdN = (n) => ({ text: String(n), fontSize: 8.5, alignment: 'center', color: G, bold: true, margin: [0, 3] });
  const tl = { hLineWidth: () => 0.5, vLineWidth: () => 0.5, hLineColor: () => '#ccc', vLineColor: () => '#ccc' };

  const t1B = [[th('No.'), th('Date'), th('Description of Work'), th('System / Software'), th('Result / Status')]];
  s1Items.forEach((r, i) => t1B.push([tdN(i + 1), td(fmtDate(s1Dates[i])), td(r.desc), td(r.sys), td(r.status)]));
  if (!s1Items.length) t1B.push([td(''), td(''), td(''), td(''), td('')]);

  const t2B = [[th('No.'), th('System / Software'), th('Work Performed'), th('Status')]];
  s2Items.forEach((r, i) => t2B.push([tdN(i + 1), td(r.sys), td(r.work), td(r.status)]));
  if (!s2Items.length) t2B.push([td(''), td(''), td(''), td('')]);

  const t3B = [[th('No.'), th('Issue Description'), th('Action Taken'), th('Result')]];
  s3Items.forEach((r, i) => t3B.push([tdN(i + 1), td(r.issue), td(r.action), td(r.result)]));
  if (!s3Items.length) t3B.push([td(''), td(''), td(''), td('')]);

  const sig = [
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1.5, lineColor: '#bdc3c7' }], margin: [0, 15, 0, 8] },
    { columns: [
      { text: [{ text: 'Prepared by:  ', bold: true, fontSize: 9 }, { text: CONFIG.name, fontSize: 10 }] },
      { text: [{ text: 'Date:  ', bold: true, fontSize: 9 }, { text: sigDate, fontSize: 10 }] }
    ], margin: [0, 0, 0, 8] }
  ];
  if (signatureBase64) {
    sig.push({ columns: [
      { text: 'Signature:', bold: true, fontSize: 9, width: 65, margin: [0, 12, 0, 0] },
      { image: signatureBase64, width: 100, height: 50 }
    ]});
  } else {
    sig.push({ text: [{ text: 'Signature:  ', bold: true, fontSize: 9 }, { text: '________________________', color: G }], margin: [0, 5, 0, 0] });
  }

  const dd = {
    pageSize: 'A4', pageMargins: [40, 40, 40, 40],
    defaultStyle: { font: fontName },
    content: [
      { text: 'IT SERVICE REPORT', fontSize: 18, bold: true, color: P, alignment: 'center' },
      { text: 'IT Service / IT Support Department', fontSize: 10, color: G, alignment: 'center', margin: [0, 2, 0, 3] },
      { text: 'Service No: ' + serviceNo, fontSize: 10, bold: true, alignment: 'center', margin: [0, 0, 0, 8] },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: P }], margin: [0, 0, 0, 12] },
      { columns: [
        { text: [{ text: 'Name:  ', bold: true, fontSize: 9 }, { text: CONFIG.name, fontSize: 10 }] },
        { text: [{ text: 'Position:  ', bold: true, fontSize: 9 }, { text: CONFIG.position, fontSize: 10 }] }
      ], margin: [0, 0, 0, 5] },
      { columns: [
        { text: [{ text: 'Reporting Period:  ', bold: true, fontSize: 9 }, { text: period, fontSize: 10 }] },
        { text: [{ text: 'Company:  ', bold: true, fontSize: 9 }, { text: CONFIG.company, fontSize: 10 }] }
      ], margin: [0, 0, 0, 10] },
      sH('1. Summary of Work Performed'),
      { table: { headerRows: 1, widths: [25, 58, '*', 90, 65], body: t1B }, layout: tl },
      sH('2. System Maintenance / Support'),
      { table: { headerRows: 1, widths: [25, 110, '*', 65], body: t2B }, layout: tl },
      sH('3. Issues / Problems Handled'),
      { table: { headerRows: 1, widths: [25, '*', '*', 65], body: t3B }, layout: tl },
      sH('4. Notes / Recommendations'),
      { text: notes || ' ', fontSize: 9 },
      ...sig
    ]
  };

  return { docDefinition: dd, serviceNo, period, sigDate };
}

// ══════════════════════════════════════════════════════════════
// ══════ PAYMENT REQUEST (jsPDF - exact same as browser) ══════
// ══════════════════════════════════════════════════════════════

function generatePaymentRequest(serviceNo, sigDate, signatureBase64) {
  const prNo = serviceNo.replace('IT-', 'PR-');
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('PAYMENT REQUEST', 105, 30, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Date: ${sigDate}`, 20, 50);
  doc.setFontSize(10);
  doc.text(`PR No: ${prNo}`, 130, 50);
  doc.setFontSize(12);

  doc.text(`Name: ${CONFIG.name}`, 20, 70);
  doc.text(`IC/NRIC: ${CONFIG.ic}`, 20, 85);
  doc.text(`Bank Name: ${CONFIG.bank}`, 20, 105);
  doc.text(`Account Number: ${CONFIG.account}`, 20, 120);
  doc.text('Expense Items:', 20, 140);

  let y = 155;
  doc.setFont(undefined, 'bold');
  doc.text('Description', 25, y);
  doc.text('Amount', 160, y);
  doc.line(20, y + 3, 190, y + 3);
  y += 15;

  doc.setFont(undefined, 'normal');
  doc.text('IT Service', 25, y);
  doc.text(`${CONFIG.currency} ${CONFIG.amount.toFixed(2)}`, 160, y);
  y += 12;

  doc.line(20, y, 190, y);
  y += 10;

  doc.setFont(undefined, 'bold');
  doc.text(`Total Amount: ${CONFIG.currency} ${CONFIG.amount.toFixed(2)}`, 25, y);
  doc.setFont(undefined, 'normal');

  y += 20;
  doc.text(`Submitted Date: ${sigDate}`, 20, y);

  y += 20;
  doc.text('Signature:', 20, y);
  if (signatureBase64) {
    try {
      doc.addImage(signatureBase64, 'PNG', 20, y + 3, 50, 25);
    } catch (e) {
      console.warn('Could not add signature to Payment Request:', e.message);
      doc.line(20, y + 15, 100, y + 15);
    }
  } else {
    doc.line(20, y + 15, 100, y + 15);
  }

  doc.rect(15, 15, 180, 260);

  const buffer = Buffer.from(doc.output('arraybuffer'));
  return { buffer, prNo };
}

// ══════════════════════════════════════════════════════════════
// ══════ EMAIL ══════
// ══════════════════════════════════════════════════════════════

async function sendEmail(itBuffer, prBuffer, period, itFileName, prFileName) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `IT Service Report & Payment Request - ${period}`,
    text: [
      `Hi,`,
      ``,
      `Please find attached the IT Service Report and Payment Request for ${period}.`,
      ``,
      `This is an automated email.`,
      ``,
      `Best regards,`,
      CONFIG.name
    ].join('\n'),
    attachments: [
      { filename: itFileName, content: itBuffer },
      { filename: prFileName, content: prBuffer }
    ]
  };

  await transporter.sendMail(mailOptions);
}

// ══════════════════════════════════════════════════════════════
// ══════ MAIN ══════
// ══════════════════════════════════════════════════════════════

async function main() {
  const info = getTargetMonth();
  const period = `${months[info.month]} ${info.year}`;
  console.log(`Generating report for ${period}...`);

  // Fetch signature
  const signatureBase64 = await fetchSignature(CONFIG.signatureUrl);

  // Generate IT Service Report (pdfmake + Roboto)
  const itReport = generateITReport(info, signatureBase64);
  const itBuffer = await generatePdfBuffer(itReport.docDefinition);
  const itFileName = `IT_Report_${CONFIG.name.replace(/\s+/g, '_')}_${period.replace(/\s+/g, '_')}.pdf`;
  console.log(`IT Report generated: ${itFileName}`);

  // Generate Payment Request (jsPDF - same as browser)
  const pr = generatePaymentRequest(itReport.serviceNo, itReport.sigDate, signatureBase64);
  const prBuffer = pr.buffer;
  const prFileName = `Payment_Request_${pr.prNo}.pdf`;
  console.log(`Payment Request generated: ${prFileName}`);

  // Send email
  await sendEmail(itBuffer, prBuffer, period, itFileName, prFileName);
  console.log(`Email sent to ${process.env.EMAIL_USER}`);
}

main().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
