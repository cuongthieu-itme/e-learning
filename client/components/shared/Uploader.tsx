'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { FileIcon, Upload, X } from 'lucide-react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';

import { cn } from '@/lib/utils';

type FileWithPreview = File & {
  preview?: string;
};

type UploaderProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  onFilesChange?: (files: FileWithPreview[]) => void;
  label?: string;
  helperText?: string;
  error?: string;
  className?: string;
  dropzoneOptions?: DropzoneOptions;
};

const Uploader = <T extends FieldValues>({
  name,
  control,
  onFilesChange,
  label = 'Drop files here or click to browse',
  helperText,
  className,
  dropzoneOptions = {
    multiple: false,
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
  },
}: UploaderProps<T>) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const updatedFiles = dropzoneOptions.multiple
        ? [...files, ...acceptedFiles].slice(
            0,
            dropzoneOptions.maxFiles || Infinity,
          )
        : acceptedFiles.slice(0, 1);

      setFiles(updatedFiles);
      onChange(updatedFiles);
      onFilesChange?.(updatedFiles);

      const imagePreviews = acceptedFiles
        .filter((file) => file.type.startsWith('image/'))
        .map((file) => URL.createObjectURL(file));
      setPreviews((prev) =>
        [...prev, ...imagePreviews].slice(0, dropzoneOptions.maxFiles),
      );
    },
    [dropzoneOptions, files, onChange, onFilesChange],
  );

  const removeFile = (fileToRemove: File) => {
    const updatedFiles = files.filter((file) => file !== fileToRemove);
    setFiles(updatedFiles);
    onChange(dropzoneOptions.multiple ? updatedFiles : null);
    onFilesChange?.(updatedFiles);

    const index = files.indexOf(fileToRemove);
    if (index !== -1 && fileToRemove.type.startsWith('image/')) {
      URL.revokeObjectURL(previews[index]);
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const reset = () => {
    setFiles([]);
    setPreviews([]);
  };

  useEffect(() => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      reset();
    }
  }, [value]);

  useEffect(() => {
    return () =>
      files.forEach(
        (file) => file.preview && URL.revokeObjectURL(file.preview),
      );
  }, [files]);

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    ...dropzoneOptions,
    onDrop,
  });

  return (
    <div className="w-full space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}

      <div
        {...getRootProps()}
        className={cn(
          'relative rounded-lg border-2 border-dashed border-gray-300 p-6 text-center',
          'hover:border-gray-400 focus:outline-none',
          isDragActive ? 'border-blue-500 bg-blue-50' : '',
          error ? 'border-red-500' : '',
          className,
        )}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-sm text-muted-foreground">
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <p>
                Drag & drop files here, or click to select
                {dropzoneOptions.maxFiles &&
                  dropzoneOptions.maxFiles > 1 &&
                  ` (max ${dropzoneOptions.maxFiles} files)`}
              </p>
            )}
          </div>
          {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
        </div>
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded-md border border-gray-200 p-2"
            >
              <div className="flex items-center space-x-2">
                {file.type.startsWith('image/') ? (
                  <Image
                    src={previews[index]}
                    alt={file.name}
                    className="h-10 w-10 rounded object-cover"
                    width={10}
                    height={10}
                  />
                ) : (
                  <FileIcon className="h-10 w-10 text-gray-400" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(file)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Uploader;
