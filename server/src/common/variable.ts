export enum Action {
    Manage = "manage",
    Create = "create",
    Read = "read",
    Update = "update",
    Delete = "delete",
}

export enum Subject {
    Users = "users",
    Roles = "roles",
    Permissions = "permissions",
    Orders = "orders",
    Items = "items",
    Categories = "categories",
    CategoryImages = "category_images",
    Vouchers = "vouchers",
    FlashSales = "flash_sales",
    FlashSalesItems = "flash_sales_items",
    All = "all",
}

export enum CartStatus {
    Pending = "pending",
    Completed = "completed",
}