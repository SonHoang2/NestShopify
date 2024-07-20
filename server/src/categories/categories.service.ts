import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Category } from './category.entity';
import { CategoryImage } from './category-image.entity';
const imgbbUploader = require("imgbb-uploader");

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category) private categoryRepo: Repository<Category>,
        @InjectRepository(CategoryImage) private categoryImageRepo: Repository<CategoryImage>,
    ) { }

    async createCategory(category: { name: string, active: boolean }) {
        const categoryExist = await this.categoryRepo.findOneBy({ name: category.name });
        // if category already exists, throw an error
        if (categoryExist) {
            throw new Error('Category already exists');
        }
        // if category does not exist, create a new category
        const newCategory = this.categoryRepo.create(category);
        return this.categoryRepo.save(newCategory);
    }

    getAllCategory() {
        return this.categoryRepo.find();
    }

    getCategory(id: number) {
        return this.categoryRepo.findOneBy({ id })
    }

    async updateCategory(id: number, attrs: Partial<Category>) {
        const category = await this.getCategory(id);

        if (!category) {
            throw new Error('Category not found');
        }

        Object.assign(category, attrs);

        return this.categoryRepo.save(category);
    }

    async deleteCategory(id: number) {
        const category = await this.getCategory(id);

        if (!category) {
            throw new Error('Category not found');
        }

        return this.categoryRepo.remove(category);
    }

    async createCategoryImage({ position, categoryId, file }) {
        const category = await this.getCategory(categoryId);

        if (!category) {
            throw new Error('Category not found');
        }
        // upload image to imgbb
        const options = {
            apiKey: process.env.IMGBB_API_KEY,
            base64string: file.buffer.toString('base64'),
            name: file.originalname,
        };

        const image = await imgbbUploader(options);

        // save image to database
        const categoryImage = this.categoryImageRepo.create({ position, category, image: image.url });

        return this.categoryImageRepo.save(categoryImage);
    }

    getAllImage(categoryId: number) {
        return this.categoryImageRepo.createQueryBuilder('category_images')
            .select('*')
            .where('category_images.categoryId = :categoryId', { categoryId })
            .getRawMany();
    }

    async getImage(id: number) {
        return this.categoryImageRepo.findOneBy({ id });
    }

    async updateImage(id: number, attrs: Partial<CategoryImage>) {
        const categoryImage = await this.getImage(id);

        if (!categoryImage) {
            throw new Error('Image not found');
        }

        Object.assign(categoryImage, attrs);
        return this.categoryImageRepo.save(categoryImage);
    }

    async deleteImage(id: number) {
        const categoryImage = await this.getImage(id);

        if (!categoryImage) {
            throw new Error('Image not found');
        }

        return this.categoryImageRepo.remove(categoryImage);
    }
}
