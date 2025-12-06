import { resetState } from "@/features/productSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { QuoteResponse } from "@/services/api";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Title } from "./title";

export const CardQuote = ({ quote }: { quote: QuoteResponse | null }) => {
    const { currency } = useAppSelector(state => state.rate)
    const { recipe } = useAppSelector(state => state.product)

    const dispatch = useAppDispatch()

    if (!quote?.data) return null;

    const amount = currency === "ARS" ? quote.data.ars : quote.data.usd
    const symbol = currency === "ARS" ? "AR$" : "US$"

    const formattedAmount = (amount || 0).toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

    return (
        <div className="flex flex-col gap-3">
            <Title>{recipe}</Title>
            <Card shadow="sm" radius="sm" fullWidth>
                <CardBody className="py-2">
                    <div className="flex w-full justify-between">
                        <div className="flex flex-col">
                            <p className="text-md font-semibold">Total</p>
                            <p className="text-tiny text-default-500">{quote.data.count} ingredientes</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="flex flex-col items-end">
                                <p className="text-md font-semibold text-nowrap">{symbol} {formattedAmount}</p>
                                <p className="text-tiny">{quote.data.weight} gr</p>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
            <Button onPress={() => dispatch(resetState())} color="primary" className="mt-2" fullWidth>Cotizar otra receta</Button>
        </div>
    )
} 