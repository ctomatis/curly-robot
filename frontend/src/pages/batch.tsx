
import DefaultLayout from "@/layouts/default";
import { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/button";
import { SelectDate } from "@/components/select-date";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { Recipe, useCreateQuoteBatchMutation, useGetProductsQuery } from "@/services/api";
import { CardRecipes } from "@/components/recipes";
import { Alert } from "@heroui/alert";
import { useAppSelector } from "@/hooks/redux";

export default function BatchPage() {
  const { isError } = useGetProductsQuery({ id: undefined })
  const [uploadFile, { isLoading }] = useCreateQuoteBatchMutation()
  const { date } = useAppSelector(state => state.rate)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const formRef = useRef<HTMLFormElement>(null)


  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setRecipes([])
    e.preventDefault()
    const form = e.currentTarget

    const fileInput = form.elements.namedItem("file") as HTMLInputElement
    const file = fileInput.files?.[0] as File
    if (!file || !date) return;

    try {
      const res = await uploadFile({ file, date }).unwrap()
      setRecipes(res)
    } catch (error) {
      // handle error
    }
  }

  useEffect(() => {
    if (date && formRef.current) {
      const file = formRef.current
        ?.querySelector("input[name='file']") as HTMLInputElement | null

      if (!file?.files?.length) return
      formRef.current.requestSubmit()
    }
  }, [date])

  return (
    <DefaultLayout>
      <section className="flex w-full py-8 gap-8 justify-center">
        <div className="flex w-1/3 flex-col gap-3">
          <Form ref={formRef} onSubmit={onSubmit}>
            {isError && <Alert variant="flat" color="danger"><span className="text-tiny">No tenés ingredientes cargados. Cargá los ingredientes.</span></Alert>}
            <SelectDate />
            <Input
              isDisabled={isError}
              name="file"
              label="Seleccionar archivo con recetas"
              isRequired
              type="file"
              fullWidth />
            <Button isDisabled={isError} isLoading={isLoading} type="submit" color="primary" fullWidth>{isLoading ? "Cotizando" : "Cotizar"}</Button>
          </Form>
        </div>
        <div className="flex w-1/3 flex-col gap-3">
          {recipes.map(item => <CardRecipes recipe={item} />)}
        </div>
      </section>
    </DefaultLayout>
  )
}




