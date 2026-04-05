using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialFeed.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FinalDataSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PostLikes",
                table: "PostLikes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CommentLikes",
                table: "CommentLikes");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "PostLikes",
                newName: "CreatedTime");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "CommentLikes",
                newName: "CreatedTime");

            migrationBuilder.AddColumn<Guid>(
                name: "ID",
                table: "PostLikes",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "PostLikes",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "ModifiedBy",
                table: "PostLikes",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedTime",
                table: "PostLikes",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "PostLikes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "ID",
                table: "CommentLikes",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "CommentLikes",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "ModifiedBy",
                table: "CommentLikes",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedTime",
                table: "CommentLikes",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "CommentLikes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostLikes",
                table: "PostLikes",
                column: "ID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CommentLikes",
                table: "CommentLikes",
                column: "ID");

            migrationBuilder.CreateIndex(
                name: "IX_PostLikes_UserId_PostId",
                table: "PostLikes",
                columns: new[] { "UserId", "PostId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CommentLikes_UserId_CommentId",
                table: "CommentLikes",
                columns: new[] { "UserId", "CommentId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PostLikes",
                table: "PostLikes");

            migrationBuilder.DropIndex(
                name: "IX_PostLikes_UserId_PostId",
                table: "PostLikes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CommentLikes",
                table: "CommentLikes");

            migrationBuilder.DropIndex(
                name: "IX_CommentLikes_UserId_CommentId",
                table: "CommentLikes");

            migrationBuilder.DropColumn(
                name: "ID",
                table: "PostLikes");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "PostLikes");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "PostLikes");

            migrationBuilder.DropColumn(
                name: "ModifiedTime",
                table: "PostLikes");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "PostLikes");

            migrationBuilder.DropColumn(
                name: "ID",
                table: "CommentLikes");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "CommentLikes");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "CommentLikes");

            migrationBuilder.DropColumn(
                name: "ModifiedTime",
                table: "CommentLikes");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "CommentLikes");

            migrationBuilder.RenameColumn(
                name: "CreatedTime",
                table: "PostLikes",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "CreatedTime",
                table: "CommentLikes",
                newName: "CreatedAt");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostLikes",
                table: "PostLikes",
                columns: new[] { "UserId", "PostId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_CommentLikes",
                table: "CommentLikes",
                columns: new[] { "UserId", "CommentId" });
        }
    }
}
