import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/Services/data.service';
import { AngularFirestore , AngularFirestoreCollection} from '@angular/fire/compat/firestore';

declare var $:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  megaMenuItems: any;
  menuItem: any;
  courseSubMenuItem: any;
  selectedCourse: any;
  couSubMenuId: any;
  courseMenuName: any;
  counsellingForm:any = FormGroup;
  userData : AngularFirestoreCollection<any>;
  submitted = false ;
  display : any;

  constructor(private dataService:DataService,public fb: FormBuilder,private db: AngularFirestore,) { }

  ngOnInit(): void {
    this.megaMenuItems = this.dataService.getMegaMenu();
    this.menuItem = this.megaMenuItems[0]['normalMenuItems'];
    // console.log(this.menuItem[0]['menuId']);
    this.getSelectedCourse(this.menuItem[0]['menuId']);
    this.userData = this.db.collection('websiteLoadpopupData');
    this.counsellingForm = this.fb.group({
      name:['', [Validators.required]],
      email:['', [Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+(\.[a-zA-Z0-9-]+)*')]],
      phone:['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      city:['', [Validators.required]],
      date : new Date(),
    });
  }

  getSelectedCourse(ID:any){
    for(let item of this.menuItem){
      if(item.menuId==ID){
        this.courseSubMenuItem = item.subMenu;
        this.couSubMenuId = item.menuId;
        this.courseMenuName = item.name ;
      }
    }
  }

  get f() {
    return this.counsellingForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.counsellingForm.invalid) {
      return;
    }
    $('#staticBackdrop').modal('hide');
      this.userData.add(this.counsellingForm.value).then(res =>{
        this.openModal();
      });
      setTimeout(()=>{
        this.onCloseHandled();
        this.submitted = false ;
        this.counsellingForm.reset();
      },6000);
  }

  // onSumbit(){
  //   $('#staticBackdrop').modal('hide');
  //   this.userData.add(this.counsellingForm.value).then(res =>{
  //     this.openModal();
  //   });
  //   this.isSubmit = true ;
  //   setTimeout(()=>{
  //     this.onCloseHandled();
  //     this.isSubmit = false ;
  //     this.counsellingForm.reset();
  //   },6000);
  // }

   // Model Open Funcation
   openModal(){
    this.display='block';
  }

  // Model close Funcation
  onCloseHandled(){
    this.display='none'
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  

}
