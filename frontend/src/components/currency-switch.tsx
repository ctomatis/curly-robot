import { ARG, USA } from "@/components/flags";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { switchCurrency } from "@/features/rateSlice";

export const CurrencySwitch = () => {
    const wh = "size-5 shrink-0";
    const dispatch = useAppDispatch()
    const { value, currency } = useAppSelector(state => state.rate)

    const toggleCurrency = () => {
        dispatch(switchCurrency())
    }

    const formattedAmount = (value || 0).toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return (
        <div className="flex items-center justify-center">
            <div className="flex items-center gap-4">
                <p className="text-tiny font-medium">1 US$ &asymp; {formattedAmount} AR$</p>
                <button
                    onClick={toggleCurrency}
                    className={`relative w-10 h-3 rounded-full transition-all duration-300 ease-in-out focus:outline-none bg-default`}
                >
                    <span
                        className={`absolute -top-2.5 -left-2 w-8 h-8 bg-none rounded-full shadow-none transform transition-transform duration-300 ease-in-out flex items-center justify-center font-bold text-sm ${currency === 'USD' ? 'translate-x-6' : ''
                            }`}
                    >
                        {currency === "ARS" ? <ARG className={wh} /> : <USA className={wh} />}
                    </span>
                </button>
            </div>
        </div>
    )

}