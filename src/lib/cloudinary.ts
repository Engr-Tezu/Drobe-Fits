import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function assertCloudinaryConfigured() {
  const { cloud_name, api_key, api_secret } = cloudinary.config();
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }
}

export async function uploadImageToCloudinary(
  buffer: Buffer,
  filename: string,
  options?: { generateBannerVariants?: boolean }
): Promise<{
  url: string;
  publicId: string;
  variants?: { mobile: string; tablet: string; desktop: string };
}> {
  assertCloudinaryConfigured();

  const result = await new Promise<{
    secure_url: string;
    public_id: string;
    eager?: Array<{ secure_url: string }>;
  }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "ld-watches",
            public_id: filename.replace(/\.[^.]+$/, ""),
            resource_type: "image",
            overwrite: false,
            ...(options?.generateBannerVariants
              ? {
                  eager: [
                    { width: 480, crop: "scale", quality: "auto", fetch_format: "auto" },
                    { width: 1024, crop: "scale", quality: "auto", fetch_format: "auto" },
                    { width: 1600, crop: "scale", quality: "auto", fetch_format: "auto" },
                  ],
                }
              : {}),
          },
          (error, uploadResult) => {
            if (error || !uploadResult) {
              reject(error || new Error("Cloudinary upload failed"));
              return;
            }
            resolve({
              secure_url: uploadResult.secure_url,
              public_id: uploadResult.public_id,
              eager: uploadResult.eager?.map((variant: { secure_url: string }) => ({
                secure_url: variant.secure_url,
              })),
            });
          }
        )
        .end(buffer);
    }
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    ...(result.eager?.length === 3
      ? {
          variants: {
            mobile: result.eager[0].secure_url,
            tablet: result.eager[1].secure_url,
            desktop: result.eager[2].secure_url,
          },
        }
      : {}),
  };
}

export default cloudinary;
