import { SelectProduct } from "@/components/select";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import DefaultLayout from "@/layouts/default";
import { NumberInput } from "@heroui/number-input";
import { useState } from "react";
import { Button } from "@heroui/button";
import { addProductToDish, setRecipeName } from "@/features/productSlice";
import { SelectDate } from "@/components/select-date";
import { CardQuote } from "@/components/quote";
import { Dish } from "@/components/products";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";

export default function IndexPage() {
  const min = Number(import.meta.env.VITE_MIN_WEIGHT)
  const max = min ** 2

  const dispatch = useAppDispatch()
  const [weight, setWeight] = useState<number>(min);
  const { items, selected, dish, quote } = useAppSelector(state => state.product)


  const addProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!weight) return;
    dispatch(addProductToDish(weight))
  }

  return (
    <DefaultLayout>
      <section className="flex w-full py-8 gap-8 justify-center">
        <div className="flex w-1/3 flex-col gap-3">
          {quote && <Dish items={dish} hasQuote={true} />}
          {!quote && <>
            <Form onSubmit={addProduct}>
              <SelectDate />

              <Input
                label="Nombre de la receta" isRequired
                placeholder="Ingresá el nombre de la receta"
                type="text"
                onValueChange={v => dispatch(setRecipeName(v))}
                fullWidth />

              <div className="flex w-full text-sm font-medium">Ingrediente</div>
              <SelectProduct index={0} />
              {items.map((item, i) => <SelectProduct index={i + 1} key={i} id={item.id} />)}

              {selected && <>
                <NumberInput
                  minValue={min}
                  maxValue={max}
                  isRequired
                  value={weight}
                  onValueChange={setWeight}
                  fullWidth
                  aria-label="Weight"
                  description={`¿Cuántos gramos querés? Mínimo ${min} gramos.`}
                  hideStepper
                  placeholder="Ingresá la cantidad en gramos"
                />
                <Button isDisabled={weight < min || weight > max} type="submit" color="primary" fullWidth>Agregar ingrediente</Button>
              </>}
            </Form>
          </>}
        </div>
        <div className="flex w-1/3 flex-col">
          {!quote && <Dish items={dish} hasQuote={false} />}
          <CardQuote quote={quote} />
        </div>
      </section>
    </DefaultLayout>
  )
}




