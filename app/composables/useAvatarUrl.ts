export const useAvatarUrl = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const getPublicUrl = (): string | undefined => {
    const avatar = user.value?.user_metadata?.avatar_url;

    if (!avatar) {
      return undefined;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(avatar);

    return data.publicUrl;
  };

  const url = ref(getPublicUrl());

  watch(
    user,
    () => {
      url.value = getPublicUrl();
    },
    { immediate: true },
  );

  return {
    url,
  };
};
