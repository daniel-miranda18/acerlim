import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { env } from "../config/env";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (
  date: Date | string | null | undefined,
): string | null => {
  if (!date) return null;
  return dayjs(date).tz(env.TZ).format("YYYY-MM-DD HH:mm:ss");
};

export const now = (): Date => dayjs().tz(env.TZ).toDate();
