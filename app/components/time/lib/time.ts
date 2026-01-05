export type TimeParts = {
    hour: string;
    minute: string;
    second: string;
};

export const pad = (n: number) => String(n).padStart(2, "0");

export const timeToSeconds = ({ hour, minute, second }: TimeParts) =>
    Number(hour) * 3600 + Number(minute) * 60 + Number(second);

export const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h} Stunden ${m} Minuten ${s} Sekunden`;
};

export const getToday = () => new Date().toISOString().slice(0, 10);

export const getNowTime = (): TimeParts => {
    const now = new Date();
    return {
        hour: pad(now.getHours()),
        minute: pad(now.getMinutes()),
        second: pad(now.getSeconds()),
    };
};

export const getEndTime = (): TimeParts => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return {
        hour: pad(now.getHours()),
        minute: pad(now.getMinutes()),
        second: pad(now.getSeconds()),
    };
};

export const emptyTime: TimeParts = {
    hour: "00",
    minute: "00",
    second: "00",
};

export const makeTimeOptions = (max: number) =>
    Array.from({ length: max }, (_, i) => pad(i));
