import { TFile } from "obsidian";
import TurndownService from "turndown";
import mime from "mime-types";

export type TransformType = "text" | "blob";

interface Ok<TValue> {
    kind: "ok";
    value: TValue;
}

interface Err<TError> {
    kind: "err";
    value: TError;
}

export function ok<TValue>(value: TValue): Ok<TValue> {
    return { kind: "ok", value };
}
export function err<TValue>(value: TValue): Err<TValue> {
    return { kind: "err", value };
}

export type TransformResult = Ok<string> | Err<string>;

export interface TransformUtilsBase {
    turndown: TurndownService;
    mime: typeof mime;
}

export interface TransformUtils extends TransformUtilsBase {
    saveAttachment: (
        name: string,
        ext: string,
        data: ArrayBuffer
    ) => Promise<TFile>;
}

export type TransformFunction = (
    input: string | ClipboardItem,
    utils: TransformUtils
) => TransformResult | string;

export type TransformOutput =
    | string
    | Promise<string>
    | TransformResult
    | Promise<TransformResult>;

export interface BlobTransform {
    type: "blob";
    transform: (input: ClipboardItem, utils: TransformUtils) => TransformOutput;
}

export interface TextTransform {
    type: "text";
    transform: (input: string, utils: TransformUtils) => TransformOutput;
}

export type Transform = BlobTransform | TextTransform;

export interface Transforms {
    [id: string]: Transform;
}
