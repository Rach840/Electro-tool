"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/ui/card"
import { Button } from "@/src/shared/ui/button"
import { Input } from "@/src/shared/ui/input"
import { Label } from "@/src/shared/ui/label"
import { Textarea } from "@/src/shared/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/ui/select"
import { Loader2, AlertCircle } from "lucide-react"
import { toast } from "@/src/shared/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/src/shared/ui/alert"
import { sendSalesMessageTelegram } from "@/src/shared/api/telegram/telegram-sales";
import { useAuth } from "@/src/app/layouts";



export default function Support() {
  const router = useRouter()
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [category, setCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
const {user} = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject || !message || !category ) {
      setError("Заполните все поля формы")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const messageResponce = `Вопрос от ${user.name} ${user.lastName} %0AПочта: ${user.email} %0AНомер телефона: ${user?.phone ? user.phone : "Не найдено" } %0AВопрос на тему ${category } %0AЗаоголовок: ${subject}  %0AСообщение: ${message} `
      await sendSalesMessageTelegram(messageResponce, 'support')

      toast({
        title: "Сообщение отправлено в поддержку",
        description: "Мы сделаем всё что в наших силах",
      })

      // Reset form
      setSubject("")
      setMessage("")
      setCategory("")



      // Redirect to support tickets list
      router.push("/")
    } catch (err) {
      setError("Ошибка отправки.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Поддержка</CardTitle>
          <CardDescription>Отправьте вопрос или жалобу в поддержку и мы сделаем всё, чтобы её решить.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Заголовок</Label>
                <Input
                  id="subject"
                  placeholder="Кратко опишите вопрос"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="grid  gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Тема вопроса</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Выберите тему вопроса" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Вопрос по заказу">Вопрос по заказу</SelectItem>
                      <SelectItem value="Вопрос по сайту">Вопрос по сайту</SelectItem>
                      <SelectItem value="Вопрос по доставке">Вопрос по доставке</SelectItem>
                      <SelectItem value="Вопрос по товару">Вопрос по товару</SelectItem>
                      <SelectItem value="Другое">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Сообщение</Label>
                <Textarea
                  id="message"
                  placeholder="Опишите вопрос/проблему в деталях"
                  className="min-h-[150px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Закрыть
              </Button>
              <Button type="submit" className="bg-[#FFB800] hover:bg-[#E5A600] text-black" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Отправка
                  </>
                ) : (
                  "Отправить в поддержку"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

