import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/api/v1/categories')
export class CategoriesController {
    constructor(
        private categoriesService: CategoriesService,
    ) { }

    @Get('/')
    async getCategories(
        @Res() res
    ) {
        try {
            const categories = await this.categoriesService.getAllCategory();
            return res.json({
                status: 'success',
                data: {
                    categories
                }
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });

        }
    }

    @Get('/:id')
    async getCategory(
        @Res() res,
        @Param('id') id: number
    ) {
        try {
            const category = await this.categoriesService.getCategory(id);

            if (!category) {
                throw new Error('Category not found');
            }

            return res.json({
                status: 'success',
                data: {
                    category
                }
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Post('/')
    async createCategory(
        @Body() body: { name: string, active: boolean },
        @Res() res) {
        try {
            const categories = await this.categoriesService.createCategory(body);
            return res.json({
                status: 'success',
                data: {
                    categories
                }
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Patch('/:id')
    async updateCategory(
        @Res() res,
        @Param('id') id: number,
        @Body() body: UpdateCategoryDto
    ) {
        try {
            const category = await this.categoriesService.updateCategory(id, body);

            return res.json({
                status: 'success',
                data: {
                    category
                }
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Delete('/:id')
    async deleteCategory(
        @Res() res,
        @Param('id') id: number,
    ) {
        try {
            const category = await this.categoriesService.deleteCategory(id);

            res.json({
                status: 'success',
                data: {
                    category
                }
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Post('/images')
    @UseInterceptors(FileInterceptor('image'))
    async createCategoryImage(
        @Res() res,
        @Body() body: { position: number, categoryId: number },
        @UploadedFile() file: Express.Multer.File
    ) {
        try {
            const categorieImage = await this.categoriesService.createCategoryImage({ ...body, file });

            return res.json({
                status: 'success',
                data: {
                    categorieImage
                }
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Get('/images/category/:categoryId')
    async getAllImage(
        @Res() res,
        @Param('categoryId') categoryId: number
    ) {
        try {
            const categoryImage = await this.categoriesService.getAllImage(categoryId);

            return res.json({
                status: 'success',
                data: {
                    categoryImage
                }
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Get('/images/:id')
    async getImage(
        @Res() res,
        @Param('id') id: number
    ) {
        try {
            const categoryImage = await this.categoriesService.getImage(id);

            if (!categoryImage) {
                throw new Error('Image not found');
            }

            return res.json({
                status: 'success',
                data: {
                    categoryImage
                }
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Patch('/images/:id')
    async updateImage(
        @Res() res,
        @Param("id") id: number,
        @Body() body: { image: string, position: number, categoryId: number },
    ) {
        try {
            const categoryImage = await this.categoriesService.updateImage(id, body);

            return res.json({
                status: 'success',
                data: {
                    categoryImage
                }
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Delete('/images/:id')
    async deleteImage(
        @Res() res,
        @Param('id') id: number
    ) {
        try {
            const categoryImage = await this.categoriesService.deleteImage(id);

            return res.json({
                status: 'success',
                data: {
                    categoryImage
                }
            });
        } catch (error) {
            return res.json({
                status: 'error',
                message: error.message,
            });
        }
    }
}
