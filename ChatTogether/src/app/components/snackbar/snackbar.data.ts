export enum SnackbarVariant {
    INFO,
    ERROR
}

export interface SnackbarData {
    message: string;
    variant: SnackbarVariant;
}