export default function calculateAge(DoBString) {
    const DoB = new Date(DoBString);
    var diff_ms = Date.now() - DoB.getTime();
    var age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

export function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}