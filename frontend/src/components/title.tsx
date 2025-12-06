import React from "react"

export const Title = ({ children }: { children: React.ReactNode }) => {
    return <div className="flex w-full text-tiny font-medium">{children}</div>
}