-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "image" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_update" BOOLEAN,
    "Reminders" BOOLEAN,
    "networking_opportunities" BOOLEAN,
    "email_notifications" BOOLEAN,
    "push_notifications" BOOLEAN,
    "allow_others_see_profile" BOOLEAN,
    "event_details" BOOLEAN,
    "anyone_can_add_to_group" BOOLEAN,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
