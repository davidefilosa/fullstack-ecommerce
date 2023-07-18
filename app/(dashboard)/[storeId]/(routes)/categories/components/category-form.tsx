"use client";

import AlertModal from "@/components/modals/alert-modals";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import UseOrigin from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface CategoryFormProps {
  inititalData: Category | null;
  billboards: Billboard[];
}
const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
});

type CategoryFormValue = z.infer<typeof formSchema>;

const CategoryForm: React.FC<CategoryFormProps> = ({
  inititalData,
  billboards,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const origin = UseOrigin();

  const title = inititalData ? "Edit category" : "Create category";
  const description = inititalData
    ? "Edit your category"
    : "Add a new category";
  const toastMessage = inititalData ? "Category updated." : "Category created.";
  const action = inititalData ? "Save changes" : "Create";

  const form = useForm<CategoryFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: inititalData || { name: "", billboardId: "" },
  });

  const onSubmit = async (data: CategoryFormValue) => {
    console.log(data);
    try {
      setLoading(true);
      if (inititalData) {
        const response = await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
        console.log(response);
      } else {
        const response = await axios.post(
          `/api/${params.storeId}/categories`,
          data
        );
        console.log(response);
      }
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success(toastMessage);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      console.log(response);
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success("Category deleted");
    } catch (error) {
      console.log(error);
      toast.error("Make sure you removed all categories using this billboard");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {inititalData && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              setOpen(true);
            }}
            disabled={loading}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Category Name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select a billboard"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {billboards.map((item) => (
                        <SelectItem value={item.id} key={item.id}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CategoryForm;
