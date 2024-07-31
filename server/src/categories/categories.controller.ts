import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PermissionsService } from 'src/permissions/permissions.service';
import { RolesService } from 'src/roles/roles.service';
import { Action, Subject } from 'src/common/variable';

@Controller('/api/v1/categories')
export class CategoriesController {
    constructor(
        private categoriesService: CategoriesService,
        private permissionsService: PermissionsService,
        private rolesService: RolesService,
    ) { }

    @Get('/')
    async getAllCategories(
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
            return res.status(400).json({
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
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Post('/')
    async createCategory(
        @Req() req,
        @Body() body: { name: string, active: boolean },
        @Res() res
    ) {
        try {
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            await this.permissionsService.checkPermission(userRole.name, Action.Create, Subject.Categories);

            const categories = await this.categoriesService.createCategory(body);
            return res.json({
                status: 'success',
                data: {
                    categories
                }
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Patch('/:id')
    async updateCategory(
        @Req() req,
        @Res() res,
        @Param('id') id: number,
        @Body() body: UpdateCategoryDto
    ) {
        try {
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            await this.permissionsService.checkPermission(userRole.name, Action.Update, Subject.Categories);

            const category = await this.categoriesService.updateCategory(id, body);

            return res.json({
                status: 'success',
                data: {
                    category
                }
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Delete('/:id')
    async deleteCategory(
        @Req() req,
        @Res() res,
        @Param('id') id: number,
    ) {
        try {
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            await this.permissionsService.checkPermission(userRole.name, Action.Delete, Subject.Categories);

            const category = await this.categoriesService.deleteCategory(id);

            res.json({
                status: 'success',
                data: {
                    category
                }
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Post('/images')
    @UseInterceptors(FileInterceptor('image'))
    async createCategoryImage(
        @Req() req,
        @Res() res,
        @Body() body: { position: number, categoryId: number },
        @UploadedFile() file: Express.Multer.File
    ) {
        try {
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            await this.permissionsService.checkPermission(userRole.name, Action.Create, Subject.CategoryImages);

            const categorieImage = await this.categoriesService.createCategoryImage({ ...body, file });

            return res.json({
                status: 'success',
                data: {
                    categorieImage
                }
            });
        } catch (error) {
            return res.status(400).json({
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
            return res.status(400).json({
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
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Patch('/images/:id')
    async updateImage(
        @Req() req,
        @Res() res,
        @Param("id") id: number,
        @Body() body: { image: string, position: number, categoryId: number },
    ) {
        try {
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            await this.permissionsService.checkPermission(userRole.name, Action.Update, Subject.CategoryImages);

            const categoryImage = await this.categoriesService.updateImage(id, body);

            return res.json({
                status: 'success',
                data: {
                    categoryImage
                }
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    @Delete('/images/:id')
    async deleteImage(
        @Res() res,
        @Param('id') id: number,
        @Req() req
    ) {
        try {
            const { role: userRole, userId } = await this.rolesService.getRoleAndUserId(req);

            // check permission for role
            await this.permissionsService.checkPermission(userRole.name, Action.Delete, Subject.CategoryImages);

            const categoryImage = await this.categoriesService.deleteImage(id);

            return res.json({
                status: 'success',
                data: {
                    categoryImage
                }
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }
}
