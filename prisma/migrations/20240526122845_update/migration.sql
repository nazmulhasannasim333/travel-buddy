-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'DEACTIVE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';
