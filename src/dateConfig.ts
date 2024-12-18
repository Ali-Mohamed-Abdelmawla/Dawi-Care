// src/utils/dateConfig.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ar"; // Import Arabic locale

// Extend dayjs with required plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set default time zone to Africa/Cairo and locale to Arabic
dayjs.tz.setDefault("Africa/Cairo");
dayjs.locale("ar");

// Export the configured dayjs instance
export default dayjs;
