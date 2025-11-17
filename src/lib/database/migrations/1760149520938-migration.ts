import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1760149520938 implements MigrationInterface {
    name = 'Migration1760149520938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."company_user_role_enum" AS ENUM('SUPER_ADMIN', 'ADMIN_ALIADO', 'OPERADOR')`);
        await queryRunner.query(`CREATE TABLE "company_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "role" "public"."company_user_role_enum" NOT NULL, "enabled" boolean NOT NULL DEFAULT true, "companyId" uuid, "userId" uuid, CONSTRAINT "PK_879141ebc259b4c0544b3f1ea4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."company_status_enum" AS ENUM('Activo', 'Inactivo')`);
        await queryRunner.query(`CREATE TYPE "public"."company_role_enum" AS ENUM('SUPER_ADMIN', 'ADMIN_ALIADO', 'OPERADOR')`);
        await queryRunner.query(`CREATE TABLE "company" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "nit" character varying(15) NOT NULL, "razonSocial" character varying(100) NOT NULL, "country" character varying(100) NOT NULL, "city" character varying(100) NOT NULL, "address" character varying(150) NOT NULL, "logoUrl" character varying(255), "status" "public"."company_status_enum" NOT NULL DEFAULT 'Activo', "role" "public"."company_role_enum" NOT NULL, "contactEmail" character varying(100) NOT NULL, "contactPhone" character varying(20) NOT NULL, "contactPhoneCountryCode" character varying(10) NOT NULL, "contactFirstName" character varying(100) NOT NULL, "contactLastName" character varying(100) NOT NULL, "contactPassword" character varying NOT NULL, "createdBy" uuid NOT NULL, CONSTRAINT "UQ_7917f87e3719deca503c1e847e4" UNIQUE ("nit"), CONSTRAINT "UQ_43558f6152bdfedab7b92e6a653" UNIQUE ("contactEmail"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."role_name_enum" AS ENUM('SUPER_ADMIN', 'ADMIN_ALIADO', 'OPERADOR')`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" "public"."role_name_enum" NOT NULL, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."otp_type_enum" AS ENUM('Iniciar Sesión', 'Restablecer Contraseña')`);
        await queryRunner.query(`CREATE TYPE "public"."otp_status_enum" AS ENUM('Activo', 'Inactivo')`);
        await queryRunner.query(`CREATE TABLE "otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "contactEmail" character varying NOT NULL, "type" "public"."otp_type_enum" NOT NULL, "status" "public"."otp_status_enum" NOT NULL DEFAULT 'Activo', "expirationDate" TIMESTAMP NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('Activo', 'Inactivo')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying NOT NULL, "secondName" character varying, "firstMiddleName" character varying NOT NULL, "secondMiddleName" character varying, "email" character varying NOT NULL, "codePhone" character varying NOT NULL, "phone" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "status" "public"."user_status_enum" NOT NULL DEFAULT 'Activo', "roleId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "company_user" ADD CONSTRAINT "FK_92e4bc953bf0ca4c707f29b0ff8" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_user" ADD CONSTRAINT "FK_b886c13768760ebda801512000b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_25f70cec6c21859297ac238c1fd" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "otp" ADD CONSTRAINT "FK_db724db1bc3d94ad5ba38518433" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`ALTER TABLE "otp" DROP CONSTRAINT "FK_db724db1bc3d94ad5ba38518433"`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_25f70cec6c21859297ac238c1fd"`);
        await queryRunner.query(`ALTER TABLE "company_user" DROP CONSTRAINT "FK_b886c13768760ebda801512000b"`);
        await queryRunner.query(`ALTER TABLE "company_user" DROP CONSTRAINT "FK_92e4bc953bf0ca4c707f29b0ff8"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
        await queryRunner.query(`DROP TABLE "otp"`);
        await queryRunner.query(`DROP TYPE "public"."otp_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."otp_type_enum"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TYPE "public"."role_name_enum"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TYPE "public"."company_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."company_status_enum"`);
        await queryRunner.query(`DROP TABLE "company_user"`);
        await queryRunner.query(`DROP TYPE "public"."company_user_role_enum"`);
    }

}

