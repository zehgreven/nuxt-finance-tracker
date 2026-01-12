<template>
  <div>
    <div class="mb-4">
      <UFormField label="Current avatar" class="w-full" help="This would be blank by default">
        <UAvatar :src="url" size="3xl" />
      </UFormField>
    </div>

    <UForm :schema="schema" :state="state" class="space-y-4 w-64" @submit="onSubmit">
      <UFormField
        class="w-full"
        name="avatar"
        label="New avatar"
        description="JPG, GIF or PNG. 1MB Max."
        help="After choosing an image click Save to acually upload the new avatar"
      >
        <UFileUpload v-slot="{ open, removeFile }" v-model="state.avatar" accept="image/*">
          <div class="flex flex-wrap items-center gap-3">
            <UAvatar
              size="lg"
              :src="state.avatar ? createObjectUrl(state.avatar) : undefined"
              icon="i-lucide-image"
            />

            <UButton
              :label="state.avatar ? 'Change image' : 'Upload image'"
              color="neutral"
              variant="outline"
              @click="open()"
            />
          </div>

          <p v-if="state.avatar" class="text-xs text-muted mt-1.5">
            {{ state.avatar.name }}

            <UButton
              label="Remove"
              color="error"
              variant="link"
              size="xs"
              class="p-0"
              @click="removeFile()"
            />
          </p>
        </UFileUpload>
      </UFormField>

      <UButton type="submit" label="Save" color="primary" />
    </UForm>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MIN_DIMENSIONS = { width: 200, height: 200 };
const MAX_DIMENSIONS = { width: 4096, height: 4096 };
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const toast = useAppToast();
const uploading = ref(false);
const { url } = useAvatarUrl();

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const schema = z.object({
  avatar: z
    .instanceof(File, {
      message: 'Please select an image file.',
    })
    .refine(file => file.size <= MAX_FILE_SIZE, {
      message: `The image is too large. Please choose an image smaller than ${formatBytes(MAX_FILE_SIZE)}.`,
    })
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Please upload a valid image file (JPEG, PNG, or WebP).',
    })
    .refine(
      file =>
        new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = e => {
            const img = new Image();
            img.onload = () => {
              const meetsDimensions =
                img.width >= MIN_DIMENSIONS.width &&
                img.height >= MIN_DIMENSIONS.height &&
                img.width <= MAX_DIMENSIONS.width &&
                img.height <= MAX_DIMENSIONS.height;
              resolve(meetsDimensions);
            };
            img.src = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        }),
      {
        message: `The image dimensions are invalid. Please upload an image between ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height} and ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} pixels.`,
      },
    ),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  avatar: undefined,
});

function createObjectUrl(file: File): string {
  return URL.createObjectURL(file);
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    uploading.value = true;

    const file = event.data.avatar;

    if (!file) {
      throw new Error('No file selected');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error } = await supabase.storage.from('avatars').upload(fileName, file);

    if (error) {
      throw error;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        avatar_url: fileName,
      },
    });

    if (updateError) {
      throw updateError;
    }

    const currentAvatarUrl = user.value?.user_metadata?.avatar_url;
    if (currentAvatarUrl) {
      const { error } = await supabase.storage.from('avatars').remove([currentAvatarUrl]);

      if (error) {
        throw error;
      }
    }

    await supabase.auth.refreshSession();

    state.avatar = undefined;

    toast.success({
      title: 'Avatar uploaded',
    });
  } catch (error: any) {
    toast.error({
      title: 'Error uploading avatar',
      description: error.message,
    });
  } finally {
    uploading.value = false;
  }
}
</script>
