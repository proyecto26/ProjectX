# ProjectX DB Library

This library was generated with [Nx](https://nx.dev).

```mermaid
erDiagram
    USER {
        int id PK
        text username
        text email
        text first_name
        text last_name
        text address_line1
        text address_line2
        text city
        text state
        text postal_code
        text country
        text phone_number
        geography location
        user_status status
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    ROLE {
        int id PK
        text name
        text description
        timestamp created_at
        timestamp updated_at
    }
    
    USER_ROLE {
        int user_id FK
        int role_id FK
        timestamp created_at
    }
    
    PERMISSION {
        int id PK
        text name
        text description
        timestamp created_at
        timestamp updated_at
    }
    
    ROLE_PERMISSION {
        int role_id FK
        int permission_id FK
        timestamp created_at
    }

    MANUFACTURER {
        int id PK FK
        text name
        manufacturer_status status
        timestamp created_at
        timestamp updated_at
    }
    
    PRODUCT {
        int id PK
        int created_by FK
        text name
        text description
        numeric estimated_price
        product_status status
        timestamp created_at
        timestamp updated_at
    }

    MANUFACTURER_PRICE {
        int manufacturer_id FK
        int product_id FK
        numeric price
        timestamp created_at
        timestamp updated_at
        PRIMARY KEY (manufacturer_id, product_id)
    }

    CART {
        int id PK
        int user_id FK
        cart_status status
        timestamp created_at
        timestamp updated_at
    }
    
    CART_ITEM {
        int id PK
        int cart_id FK
        int product_id FK
        integer quantity
        timestamp created_at
        timestamp updated_at
    }
    
    ORDER {
        int id PK
        int user_id FK
        int cart_id FK
        numeric total_price
        order_status status
        timestamp created_at
        timestamp updated_at
    }
    
    ORDER_ITEM {
        int id PK
        int order_id FK
        int product_id FK
        integer quantity
        numeric price_at_purchase
        int manufacturer_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    PAYMENT {
        int id PK
        int order_id FK
        text provider
        payment_status status
        text transaction_id
        numeric amount
        timestamp created_at
        timestamp updated_at
    }

    REVIEW {
        int id PK
        int manufacturer_id FK
        int user_id FK
        int item_rating
        int communication_rating
        int shipping_rating
        text comments
        boolean anonymous
        boolean share_in_feed
        timestamp created_at
        timestamp updated_at
    }
    
    USER ||--o{ PRODUCT : "created by"
    USER ||--o{ ORDER : "places"
    USER ||--o{ CART : "owns"
    USER ||--o{ USER_ROLE : "has"
    USER ||--o{ MANUFACTURER : "owns"
    USER ||--o{ REVIEW : "writes"
    PRODUCT ||--o{ ORDER_ITEM : "contains"
    PRODUCT ||--o{ MANUFACTURER_PRICE : "has"
    ORDER ||--o{ ORDER_ITEM : "includes"
    CART ||--o{ CART_ITEM : "contains"
    CART_ITEM ||--o{ PRODUCT : "references"
    ORDER_ITEM ||--o{ PRODUCT : "references"
    ORDER_ITEM ||--o{ USER : "manufactured by"
    ORDER ||--o{ PAYMENT : "has"
    ROLE ||--o{ USER_ROLE : "assigned to"
    ROLE ||--o{ ROLE_PERMISSION : "grants"
    PERMISSION ||--o{ ROLE_PERMISSION : "assigned to"
    MANUFACTURER ||--o{ ORDER_ITEM : "assigned to"
    MANUFACTURER ||--o{ REVIEW : "receives"
    MANUFACTURER ||--o{ MANUFACTURER_PRICE : "sets"

    %% Notes to indicate enum types
    note right of USER::status
      Enum: user_status
      Values: Active, Inactive, Deleted, Suspended
    end note

    note right of PRODUCT::status
      Enum: product_status
      Values: Available, Unavailable, Discontinued
    end note

    note right of CART::status
      Enum: cart_status
      Values: Active, Abandoned, Completed
    end note

    note right of ORDER::status
      Enum: order_status
      Values: Pending, Confirmed, Shipped, Delivered, Cancelled
    end note

    note right of PAYMENT::status
      Enum: payment_status
      Values: Pending, Completed, Failed, Refunded
    end note

    note right of MANUFACTURER::status
      Enum: manufacturer_status
      Values: Active, Inactive, Suspended, UnderReview
    end note
```

## Running unit tests

Run `nx test db` to execute the unit tests via [Jest](https://jestjs.io).
