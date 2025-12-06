import DefaultLayout from "@/layouts/default";
import { FileResponse, useUploadProductsMutation } from "@/services/api";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useRef, useState } from "react";

const ALLOWED_MINES = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/pdf"]

export default function UploadPage() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [currentFile, setCurrentFile] = useState<File>()
  const [uploadFile, { isLoading }] = useUploadProductsMutation()
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [totalItems, setTotalItems] = useState<number>(-1)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalItems(-1)
    setErrorMessage("")
    setSuccessMessage("")
    const { files } = e.target
    if (files && files.length > 0) {
      const { size, type } = files[0]

      if (!ALLOWED_MINES.includes(type)) {
        setErrorMessage(`Tipo ${type} de archivo no soportado.`)
        e.target.value = ""
        return
      }

      if (size) {
        setCurrentFile(files[0])
        try {
          const { message, total } = await uploadFile({ file: files[0] }).unwrap()
          setSuccessMessage(message)
          setTotalItems(total)
        } catch (e) {
          const { data: { message } } = e as { data: FileResponse }
          setErrorMessage(message)
        } finally {
          setCurrentFile(undefined)
        }

      }
    }
    e.target.value = ""
  }

  const handleOpen = () => {
    if (fileRef.current) {
      fileRef.current.click()
    }
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-2 py-8">
        <div className="inline-block max-w-lg text-center justify-center">
          <Button isLoading={isLoading} color="primary" onPress={handleOpen}>
            {!isLoading ? "Seleccionar archivo" : `Procesando ${currentFile?.name}...`}
          </Button>
          <Input
            className="hidden"
            size="sm"
            type="file"
            onChange={handleFileChange}
            accept={ALLOWED_MINES.join()}
            ref={fileRef} />
        </div>
        <div className="text-danger text-tiny">{errorMessage}</div>
        <div className="text-success text-tiny">{successMessage}</div>
        {totalItems > 0 && <div className="text-tiny">Se cargaron {totalItems} ingredientes.</div>}
      </section>
    </DefaultLayout>
  );
}
