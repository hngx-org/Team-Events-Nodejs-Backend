/*
  Warnings:

  - You are about to drop the column `created_at` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `event_description` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `event_end` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `event_name` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `event_start` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserGroup` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPaidEvent` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfAvailableTickets` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizerId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrationClosingDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticketPrice` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Auth" ADD VALUE 'basic';

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_created_by_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_event_id_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_created_by_fkey";

-- DropForeignKey
ALTER TABLE "EventGroup" DROP CONSTRAINT "EventGroup_event_id_fkey";

-- DropForeignKey
ALTER TABLE "EventGroup" DROP CONSTRAINT "EventGroup_group_id_fkey";

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_created_by_fkey";

-- DropForeignKey
ALTER TABLE "UserGroup" DROP CONSTRAINT "UserGroup_group_id_fkey";

-- DropForeignKey
ALTER TABLE "UserGroup" DROP CONSTRAINT "UserGroup_user_id_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "event_description",
DROP COLUMN "event_end",
DROP COLUMN "event_name",
DROP COLUMN "event_start",
DROP COLUMN "updated_at",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "eventLink" TEXT,
ADD COLUMN     "isPaidEvent" BOOLEAN NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "numberOfAvailableTickets" INTEGER NOT NULL,
ADD COLUMN     "organizerId" TEXT NOT NULL,
ADD COLUMN     "registrationClosingDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "ticketPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstname" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "lastname" TEXT,
ADD COLUMN     "phone_no" TEXT;

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "EventGroup";

-- DropTable
DROP TABLE "Group";

-- DropTable
DROP TABLE "UserGroup";

-- CreateTable
CREATE TABLE "UserEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
