/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `ai_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(191) NOT NULL,
    `category_thumbnail` VARCHAR(191) NOT NULL,
    `primary_color` VARCHAR(191) NOT NULL,
    `status` BIT(1) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question_name` VARCHAR(191) NOT NULL,
    `question_description` TEXT NOT NULL,
    `question_gpt` TEXT NOT NULL,
    `status` BIT(1) NOT NULL DEFAULT true,
    `type` VARCHAR(191) NOT NULL DEFAULT '',
    `category_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_option` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `option_name` VARCHAR(191) NOT NULL,
    `option_description` TEXT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT '',
    `question_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_selected_option` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `option_id` INTEGER NOT NULL,
    `selection_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_selection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NOT NULL DEFAULT 3,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chatgpt_answer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chatgpt_answer` LONGTEXT NOT NULL,
    `selected_option_id` INTEGER NOT NULL,

    UNIQUE INDEX `chatgpt_answer_selected_option_id_key`(`selected_option_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatGPTQuestionAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chatgpt_question_answer` LONGTEXT NOT NULL,
    `chat_question_id_answer` INTEGER NOT NULL,

    UNIQUE INDEX `ChatGPTQuestionAnswer_chat_question_id_answer_key`(`chat_question_id_answer`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ai_question` ADD CONSTRAINT `ai_question_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `ai_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_option` ADD CONSTRAINT `ai_option_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `ai_question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_selected_option` ADD CONSTRAINT `ai_selected_option_option_id_fkey` FOREIGN KEY (`option_id`) REFERENCES `ai_option`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_selected_option` ADD CONSTRAINT `ai_selected_option_selection_id_fkey` FOREIGN KEY (`selection_id`) REFERENCES `ai_selection`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_selection` ADD CONSTRAINT `ai_selection_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `ai_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chatgpt_answer` ADD CONSTRAINT `chatgpt_answer_selected_option_id_fkey` FOREIGN KEY (`selected_option_id`) REFERENCES `ai_selected_option`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatGPTQuestionAnswer` ADD CONSTRAINT `ChatGPTQuestionAnswer_chat_question_id_answer_fkey` FOREIGN KEY (`chat_question_id_answer`) REFERENCES `ai_question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
