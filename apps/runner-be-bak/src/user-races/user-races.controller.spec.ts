import { Test, TestingModule } from "@nestjs/testing";
import { UserRacesController } from "./user-races.controller";
import { UserRacesService } from "./user-races.service";

describe("UserRacesController", () => {
  let controller: UserRacesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRacesController],
      providers: [UserRacesService],
    }).compile();

    controller = module.get<UserRacesController>(UserRacesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
