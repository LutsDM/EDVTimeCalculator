export type TimeParts = {
    hour: string;
    minute: string;
};

export const pad = (n: number) => String(n).padStart(2, "0");

export const timeToMinutes = ({ hour, minute }: TimeParts) =>
    Number(hour) * 60 + Number(minute);

export const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    return `${h} Stunden ${m} Minuten`;
};

export const getToday = () => new Date().toISOString().slice(0, 10);

export const getNowTime = (): TimeParts => {
    const now = new Date();
    return {
        hour: pad(now.getHours()),
        minute: pad(now.getMinutes()),
    };
};

export const getEndTime = (): TimeParts => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return {
        hour: pad(now.getHours()),
        minute: pad(now.getMinutes()),
    };
};

export const emptyTime: TimeParts = {
    hour: "00",
    minute: "00",
};

export const makeTimeOptions = (max: number) =>
    Array.from({ length: max }, (_, i) => pad(i));
