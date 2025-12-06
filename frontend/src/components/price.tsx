export const Price = ({ price, rate, currency = "ARS" }: { price?: number, rate?: number, currency?: string }) => {
    if (!price) return null;
    const symbol = currency === 'ARS' ? "AR$" : "US$";
    const _rate = currency === 'ARS' ? 1 : (rate ?? 1);
    const formatPrice = (value: number) => {

        const val = value / _rate
        return `${symbol} ${val.toLocaleString("es-AR", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
    }
    return <span className="text-nowrap">{formatPrice(price)}</span>;
}