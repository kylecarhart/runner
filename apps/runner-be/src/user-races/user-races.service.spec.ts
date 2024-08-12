import { Test, TestingModule } from "@nestjs/testing";
import { UserRacesService } from "./user-races.service";

describe("UserRacesService", () => {
  let service: UserRacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRacesService],
    }).compile();

    service = module.get<UserRacesService>(UserRacesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
