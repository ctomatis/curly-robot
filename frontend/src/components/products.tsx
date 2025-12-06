import { Product, removeProductFromDish } from "@/features/productSlice"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { Quote, useCreateQuoteMutation } from "@/services/api"
import { Button } from "@heroui/button"
import { Card, CardBody } from "@heroui/card"
import { Spinner } from "@heroui/spinner"
import { DeleteIcon } from "./icons"
import { Price } from "./price"
import { Title } from "./title"


const minWeight = Number(import.meta.env.VITE_MIN_FRACTION)

export const Dish = ({ items, hasQuote }: { items: Product[], hasQuote: boolean }) => {
  const { value, status, currency, date } = useAppSelector(state => state.rate)
  const [createQuote, { isLoading }] = useCreateQuoteMutation()
  const dispatch = useAppDispatch()

  const multiplo = (gr?: number): number => {
    if (!gr) return 0;
    return (Math.ceil(gr / minWeight) * minWeight) / 1000;
  }

  const onSubmit = async () => {
    const payload = { date: date, items } as Quote
    try {
      await createQuote(payload).unwrap()
    } catch (e) {
      // handle error
    }
  }

  const loading = status !== "fulfilled"
  return (
    <div className="flex flex-col gap-3">
      {hasQuote && <Title>Ingredientes</Title>}
      {items.map((item, i) => <Card key={i} isHoverable shadow="sm" radius="sm" fullWidth>
        <CardBody className="py-2">
          <div className="flex w-full justify-between">
            <div className="flex flex-col">
              <p className="text-md">{item.name}</p>
              <p className="text-tiny text-default-500">{<Price currency={currency} rate={value} price={item.price} />} kg</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex flex-col items-end">
                <p className="text-md font-semibold"><Price currency={currency} rate={value} price={(item?.price ?? 0) * multiplo(item?.weight)} /></p>
                <p className="text-tiny">{item.weight} gr</p>
              </div>
              {!hasQuote && <Button
                isDisabled={loading}
                title="Eliminar"
                onPress={() => dispatch(removeProductFromDish(i))}
                variant="flat"
                startContent={loading ? <Spinner color="current" size="sm" /> : <DeleteIcon className="text-sm" />}
                isIconOnly size="sm" radius="full" />}
            </div>
          </div>
        </CardBody>
      </Card>)}
      {(!!items.length && !hasQuote) && <div className="grid grid-cols-2 gap-5">
        <Button onPress={_ => dispatch(removeProductFromDish())} className="mt-2" fullWidth>Limpiar</Button>
        <Button isLoading={isLoading} onPress={onSubmit} color="primary" className="mt-2" fullWidth>{!isLoading ? "Cotizar receta" : "Cotizando"}</Button>
      </div>}
    </div>
  );
}