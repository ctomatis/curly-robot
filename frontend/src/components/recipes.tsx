import { useAppSelector } from "@/hooks/redux";
import {  Recipe } from "@/services/api";
import { Card, CardBody } from "@heroui/card";
import { Title } from "./title";

export const CardRecipes = ({ recipe }: { recipe: Recipe }) => {
    const { currency } = useAppSelector(state => state.rate)

    const amount = currency === "ARS" ? recipe.ars : recipe.usd
    const symbol = currency === "ARS" ? "AR$" : "US$"

    const formattedAmount = (amount || 0).toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

    return (
        <>
            <Title>{recipe.recipe}</Title>
            <Card shadow="sm" radius="sm" fullWidth>
                <CardBody className="py-2">
                    <div className="flex w-full justify-between">
                        <div className="flex flex-col">
                            <p className="text-md font-semibold">Total</p>
                            <p className="text-tiny text-default-500">{recipe.count} ingredientes</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="flex flex-col items-end">
                                <p className="text-md font-semibold text-nowrap">{symbol} {formattedAmount}</p>
                                <p className="text-tiny">{recipe.weight} gr</p>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>
    )
} 