import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useGetProductsQuery } from "@/services/api"
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";
import { addItem, addProduct } from "@/features/productSlice";
import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";
import { Price } from "./price";

export interface SelectProductProps {
    id?: number
    index: number
}

export const SelectProduct = ({ id, index }: SelectProductProps) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { value: rate, currency } = useAppSelector(state => state.rate)
    const [value, setValue] = useState<string>("");
    const { data, isFetching } = useGetProductsQuery({ id })
    const items = data?.data.items || []


    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target
        setValue(value)

        const selectedItem = items.find(item => item.id === Number(value))
        if (selectedItem) {
            if (!selectedItem.price) {
                dispatch(addItem({ product: selectedItem, index }))
            } else {
                dispatch(addProduct(selectedItem))
            }
        }
    };

    if (isFetching) return null;

    const has_price = items.length > 0 && items[0].price

    const emptyContent = (
        <div className="flex w-full justify-between items-center">
            <p className="text-sm">No hay ingredientes para armar tu receta.</p>
            <Button color="primary" onPress={() => navigate("/upload")} size="sm">Cargar</Button>
        </div>
    )

    return (
        <Select
            listboxProps={{
                emptyContent: emptyContent,
            }}
            selectionMode="single"
            description={has_price && "Precio por kilogramo (kg) de ingrediente."}
            isDisabled={rate === 1}
            isRequired
            fullWidth
            selectedKeys={[value]}
            onChange={handleSelectionChange}
            label={`Seleccionar una opción`}>
            {items.map((item) => (
                <SelectItem
                    endContent={<Price currency={currency} rate={rate} price={item.price} />}
                    key={item.id}>{item.name}</SelectItem>
            ))}
        </Select>
    );
}