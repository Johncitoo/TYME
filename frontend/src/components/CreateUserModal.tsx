import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function CreateUserModal() {
  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    second_last_name: "",
    email: "",
    password: "",
    rut: "",
    phone: "",
    user_type: "",
    gender: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating user:", form)
    // TODO: Connect to backend
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-tyme text-white">Create User</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogTitle>Create New User</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input name="first_name" value={form.first_name} onChange={handleChange} required />
            </div>
            <div>
              <Label>Middle Name</Label>
              <Input name="middle_name" value={form.middle_name} onChange={handleChange} />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input name="last_name" value={form.last_name} onChange={handleChange} required />
            </div>
            <div>
              <Label>Second Last Name</Label>
              <Input name="second_last_name" value={form.second_last_name} onChange={handleChange} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" name="password" value={form.password} onChange={handleChange} required />
            </div>
            <div>
              <Label>RUT</Label>
              <Input name="rut" value={form.rut} onChange={handleChange} placeholder="12345678-9" required />
            </div>
            <div>
              <Label>Phone</Label>
              <Input name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div>
              <Label>User Type</Label>
              <select name="user_type" value={form.user_type} onChange={handleChange} className="w-full border rounded-md px-3 py-2">
                <option value="">Select</option>
                <option value="1">Client</option>
                <option value="2">Trainer</option>
              </select>
            </div>
            <div>
              <Label>Gender</Label>
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded-md px-3 py-2">
                <option value="">Select</option>
                <option value="1">Male</option>
                <option value="2">Female</option>
                <option value="3">Other</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="bg-tyme text-white w-full mt-4">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
