import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { UploadThingError } from "uploadthing/server";
import { getServerAuthSession } from "@/server/auth";

const f = createUploadthing();

async function auth() {
    const session = await getServerAuthSession();
    return session?.user;
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10, minFileCount: 1 } })
        // Set permissions and file types for this FileRoute
        .middleware(async () => {
            // This code runs on your server before upload
            const user = await auth();
            console.log("user", user);

            // // // If you throw, the user will not be able to upload
            // if (!user) throw new UploadThingError("Unauthorized");
            if (!user) throw new Error("Unauthorized");

            // // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: user.id };
        })
        // .onUploadComplete(async ({ metadata, file }) => {
        .onUploadComplete(async () => {
            // This code RUNS ON YOUR SERVER after upload
            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            // return { fileUrl: file.url, fileKey: file.key, fileName: file.name };
            return {};
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
