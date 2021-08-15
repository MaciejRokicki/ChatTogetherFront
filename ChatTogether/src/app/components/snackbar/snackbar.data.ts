export enum SnackbarVariant {
    INFO,
    SUCCESS,
    ERROR
}

export interface SnackbarData {
    message: string;
    variant: SnackbarVariant;
}