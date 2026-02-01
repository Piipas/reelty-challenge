import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SAMPLE_VIDEOS } from "@/data/sample-videos";
import { Dispatch, SetStateAction } from "react";
import { Thumbnail } from "@remotion/player";

const schema = z.object({
  url: z.url(),
  duration: z.coerce.number<number>(),
});

export function VideoForm({
  setActiveClips,
  setIsDialogOpen,
}: {
  setActiveClips: Dispatch<SetStateAction<typeof SAMPLE_VIDEOS>>;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      url: "",
      duration: 1,
    },
  });

  const handleSubmit = (values: z.infer<typeof schema>) => {
    const clip = { ...values, id: new Date().getTime().toString(), thumbnail: "" };
    setActiveClips((prev) => [...prev, clip]);
    setIsDialogOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="url-input">Video URL</FormLabel>
              <FormControl>
                <Input id="url-input" placeholder="https://rendy.io/video/best-video-ever-generated.mp4" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-2 items-end">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="duration-input">Video duration</FormLabel>
                <FormControl>
                  <Input id="duration-input" placeholder="15" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button variant={"default"} className="w-full" type="submit">
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
}
