'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Group, Loader, Stack, Text } from '@mantine/core';
import {
  Dropzone,
  DropzoneProps,
  FileWithPath,
  IMAGE_MIME_TYPE,
} from '@mantine/dropzone';
import { IconPhoto, IconX } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import ImageDefault from '@repo/components/common/images/default';
import { FormProduct } from '@/hooks/form/product';
import { generateUUID } from '@repo/utilities/generators';
import { imageUpload } from '@repo/services/api/file/image';
import { Variant } from '@repo/types/enums';
import { useNotification } from '@repo/hooks/notification';

export default function Image({
  props,
  imageProps,
  ...restProps
}: {
  props: { form: FormProduct };
  imageProps?: any;
  restProps?: Partial<DropzoneProps>;
}) {
  const productIdRef = useRef(generateUUID());

  const { showNotification } = useNotification();

  const [status, setStatus] = useState<
    'accept' | 'loading' | 'reject' | 'idle'
  >('idle');
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const openRef = useRef<() => void>(null);

  useEffect(() => {
    if (props.form.values.image) {
      setStatus('accept');
    }
  }, []);

  const previews = files.map((file, i) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <ImageComponent
        key={i}
        props={{ src: imageUrl, alt: file.name }}
        {...imageProps}
      />
    );
  });

  const handleUpload = async (selectedFiles: FileWithPath[]) => {
    try {
      setStatus('loading');
      const formData = new FormData();
      formData.append('file', selectedFiles[0]); // ✅ use directly

      const productId = props.form.values.id || productIdRef.current;

      const res = await imageUpload(formData, productId, '/products', {
        bustCache: true,
      });
      const { url, imageId, error } = await res.json();

      if (error) throw new Error(error);

      props.form.setValues({
        ...props.form.values,
        image: url,
        image_id: imageId,
        id: productId,
      });

      setStatus('accept');
    } catch (e) {
      showNotification({
        variant: Variant.FAILED,
        title: 'Image Upload Failed',
        desc: (e as Error).message,
      });
      setStatus('reject');
    }
  };

  useEffect(() => {
    if (!props.form.values.image) {
      // Form reset → clear local state
      setFiles([]);
      setStatus('idle');
    } else {
      // Form has an image (maybe from default values or upload)
      setStatus('accept');
    }
  }, [props.form.values.image]);

  return (
    <Card padding={0} withBorder bg={'transparent'}>
      <Dropzone
        onDrop={async (files) => {
          if (status === 'loading') return; // only block when uploading

          setFiles(files);
          setStatus('accept');
          await handleUpload(files);
        }}
        onReject={(files) => {
          setFiles([]);
          setStatus('reject');
          console.log('rejected files', files);
        }}
        maxSize={1 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        openRef={openRef}
        activateOnClick={false}
        {...restProps}
      >
        <Stack justify="center" mih={240} style={{ pointerEvents: 'none' }}>
          {status == 'accept' && (
            <Group justify="center">
              {props.form.values.image ? (
                previews.length ? (
                  previews[0]
                ) : (
                  <ImageComponent
                    props={{
                      src: props.form.values.image, // ✅ now directly uses ImageKit URL
                      alt: props.form.values.title,
                    }}
                    {...imageProps}
                  />
                )
              ) : (
                previews[0]
              )}
            </Group>
          )}

          {status == 'idle' && idle}
          {status == 'reject' && reject}

          {status == 'loading' ? (
            loading
          ) : (
            <Group justify="center">
              <Button
                onClick={() => openRef.current?.()}
                style={{ pointerEvents: 'all' }}
                variant="light"
              >
                Upload{status == 'accept' ? ' New' : ''}
              </Button>
            </Group>
          )}
        </Stack>
      </Dropzone>
    </Card>
  );
}

const loading = (
  <div>
    <Group justify="center">
      <Loader />
    </Group>

    <Stack ta={'center'} gap={'xs'} mt={'md'} px={'xl'}>
      <Text inherit>Uploading product image</Text>
    </Stack>
  </div>
);

const idle = (
  <div>
    <Group justify="center">
      <IconPhoto
        size={ICON_SIZE * 2.5}
        color="var(--mantine-color-dimmed)"
        stroke={ICON_STROKE_WIDTH}
      />
    </Group>

    <Stack ta={'center'} gap={'xs'} mt={'md'} px={'xl'}>
      <div>
        <Text inherit>Upload product image</Text>

        <Text inherit fz={'sm'} c="dimmed">
          (Must not exceed 1 mb)
        </Text>
      </div>

      <Text inherit fz={'sm'} c="dimmed">
        Accepted types: png, gif, jpeg, svg+xml, webp, avif, heic, heif
      </Text>
    </Stack>
  </div>
);

const reject = (
  <div>
    <Group justify="center">
      <IconX
        size={ICON_SIZE * 2.5}
        color="var(--mantine-color-red-6)"
        stroke={ICON_STROKE_WIDTH}
      />
    </Group>

    <Stack ta={'center'} gap={'xs'} mt={'md'} px={'xl'}>
      <Text inherit>Image could not be uploaded</Text>

      <Text inherit fz={'sm'} c="dimmed">
        File type invalid, too large, or an internal server error has occured.
      </Text>
    </Stack>
  </div>
);

const ImageComponent = ({
  props,
  ...restProps
}: {
  props: { src: string; alt: string };
}) => {
  return (
    <ImageDefault
      key={'default'}
      src={props.src}
      alt={props.alt}
      height={120}
      width={120}
      radius={999}
      onLoad={() => URL.revokeObjectURL(props.src)}
      {...restProps}
    />
  );
};
