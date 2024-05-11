import {inject} from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {GameRepository} from "./services/game.repository";

export const hasRunningGames: CanActivateFn =
    (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
      const gamesRepo = inject(GameRepository)
      const router = inject(Router)
      return gamesRepo.getGames()
          .then(results => {
            if (results.length > 0)
              return true
            return router.parseUrl('/')
          })
    }
