import { useAppSelector } from "@/hooks/redux";
import { Recipe } from "@/services/api";
import { Card, CardBody } from "@heroui/card";
import { Title } from "./title";
import { useState } from "react";

export const CardRecipes = ({ recipe }: { recipe: Recipe }) => {
    const [show, setShow] = useState<boolean>(false)
    const { currency } = useAppSelector(state => state.rate)
    const symbol = currency === "ARS" ? "AR$" : "US$"

    const formattedAmount = (amount: number) => (amount || 0).toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

    const getPrice = (val: any) => {
        return formattedAmount(currency === "ARS" ? val.ars : val.usd)
    }

    return (
        <>
            <Title>{recipe.recipe}</Title>
            <Card shadow="sm" radius="sm" fullWidth>
                <CardBody className="py-2 flex-col">
                    <div className="flex w-full justify-between">
                        <div className="flex flex-col">
                            <p className="text-md font-semibold">Total</p>
                            <p onClick={() => setShow(!show)} className="hover:underline text-tiny text-default-500 cursor-pointer">{recipe.count} ingredientes</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="flex flex-col items-end">
                                <p className="text-md font-semibold text-nowrap">{symbol} {formattedAmount(currency === "ARS" ? recipe.ars : recipe.usd)}</p>
                                <p className="text-tiny">{recipe.weight} gr</p>
                            </div>
                        </div>
                    </div>
                    {show && recipe.products.map(item => <div className="p-1.5 rounded-md flex hover:bg-default-300 w-full justify-between mt-2">
                        <div className="flex flex-col">
                            <p className="text-sm">{item.name}</p>
                            <p className="text-tiny text-default-500">{symbol} {getPrice(item.unit_price as any)} por kg</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-sm">{symbol} {getPrice(item.price as any)}</p>
                            <p className="text-tiny">{item.weight} gr</p>
                        </div>
                    </div>)}

                </CardBody>
            </Card>
        </>
    )
} 