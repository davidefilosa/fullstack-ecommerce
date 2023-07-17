"use client";

import AlertModal from "@/components/modals/alert-modals";
import ApiAlert from "@/components/ui/api-alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import UseOrigin from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Store } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { TypeOf } from "zod";

interface SettingsFormProps {
  inititalData: Billboard | null;
}
const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

type SettingsFormValue = z.infer<typeof formSchema>;

const BillboardForm: React.FC<SettingsFormProps> = ({ inititalData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const origin = UseOrigin();

  const title = inititalData ? "Edit billborad" : "Create billboard";
  const description = inititalData
    ? "Edit your billborad"
    : "Add a new billboard";
  const toastMessage = inititalData
    ? "Billborad updated."
    : "Billboard created.";
  const action = inititalData ? "Save changes" : "Create";

  const form = useForm<SettingsFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: inititalData || { label: "", imageUrl: "" },
  });

  const onSubmit = async (data: SettingsFormValue) => {
    console.log(data);
    try {
      setLoading(true);
      if (inititalData) {
        const response = await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
        console.log(response);
      } else {
        const response = await axios.post(
          `/api/${params.storeId}/billboards`,
          data
        );
        console.log(response);
      }

      router.push(`/${params.storeId}/billboards`);
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
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      console.log(response);
      router.refresh();
      router.push("/");
      toast.success("Billboard deleted");
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => {
                      field.onChange(url);
                    }}
                    onRemove={() => {
                      field.onChange("");
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard Label"
                      {...field}
                    />
                  </FormControl>

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
      <Separator />
    </>
  );
};

export default BillboardForm;
