import debounce from "debounce";
import { computed, observable, reaction } from "mobx";
import { useDisposable } from "mobx-react-lite";
import { NextRouter, useRouter } from "next/router";
import { useEffect } from "react";
import { UserProfile } from "../models/userProfile.interface";
import { IRootService } from "./root-sevice.interface";

export class UserService implements IRootService {
  @observable public loading: boolean = false;
  @observable public askToLogIn: boolean = false;
  @observable private data: {
    user: UserProfile;
  } = {
    user: null,
  };
  private router: NextRouter;

  @computed get user() {
    return this.data.user;
  }
  @computed get isGuest() {
    return !this.data.user && !this.loading;
  }
  @computed get isOpenLoginDialog() {
    return this.askToLogIn && !this.data.user && !this.loading;
  }

  private setLoading = debounce<(value: boolean) => void>((value) => {
    this.loading = value;
  }, 50);

  public useUserChange(callback: (user: UserProfile) => void) {
    useDisposable(() =>
      reaction(
        () => this.data.user,
        callback,
      ),
    );
  }

  public useHook() {
    this.router = useRouter();
    useEffect(() => {
      const cachedUser = localStorage.getItem("user_object");
      if (cachedUser) {
        try {
          this.data.user = JSON.parse(cachedUser);
        } catch (e) {
          // tslint:disable-next-line: no-console
          console.error(e);
        }
      }
    }, []);
  }

  public changeModeTo(mode: string = "") {
    const query = {
      ...this.router.query,
      mode,
    };
    const url = this.router.asPath.split("?")[0];
    this.router.replace(url, url, {
      shallow: true,
      query,
    });
  }

  public async logout() {
    this.setLoading(true);
    try {
      this.data.user = null;
      localStorage.setItem("access_token", null);
      localStorage.setItem("user_object", null);
    } catch (e) {
      // tslint:disable-next-line
      console.error(e);
    } finally {
      this.setLoading(false);
    }
  }

  public onAuthCallback = (response: any) => {
    localStorage.setItem("access_token", response.Zi.access_token);
    localStorage.setItem("user_object", JSON.stringify(response.profileObj));
    this.data.user = response.profileObj;
  }
}
