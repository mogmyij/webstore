-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending_payment', 'payment_failed', 'awaiting_shipment', 'shipped', 'delivered', 'cancelled');

-- CreateEnum
CREATE TYPE "HitPayTransactionStatus" AS ENUM ('pending', 'succeeded', 'failed', 'requires_action');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "image" TEXT NOT NULL,
    "images" TEXT[],
    "brand" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "specifications" JSONB NOT NULL,
    "features" TEXT[],
    "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userFacingOrderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "customerNotes" TEXT,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "shippingCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending_payment',

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HitPayTransaction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paymentRequestId" TEXT,
    "paymentId" TEXT,
    "hitpayReferenceNumber" TEXT,
    "status" "HitPayTransactionStatus" NOT NULL DEFAULT 'pending',
    "amount" DECIMAL(10,2),
    "currency" TEXT,
    "paymentMethodType" TEXT,
    "paymentMethodBrand" TEXT,
    "paymentMethodLast4" TEXT,
    "transactionDate" TIMESTAMP(3),
    "webhookReceivedAt" TIMESTAMP(3),
    "orderId" TEXT NOT NULL,

    CONSTRAINT "HitPayTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_userFacingOrderId_key" ON "Order"("userFacingOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "HitPayTransaction_paymentRequestId_key" ON "HitPayTransaction"("paymentRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "HitPayTransaction_paymentId_key" ON "HitPayTransaction"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "HitPayTransaction_hitpayReferenceNumber_key" ON "HitPayTransaction"("hitpayReferenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "HitPayTransaction_orderId_key" ON "HitPayTransaction"("orderId");
